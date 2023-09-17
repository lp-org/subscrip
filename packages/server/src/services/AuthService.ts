import { NewUser, PgJsDatabaseType, user, userSchema } from "db";
import { RESOLVER } from "awilix";
import { and, eq } from "drizzle-orm";
import Scrypt from "scrypt-kdf";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};
export default class AuthService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  paymentGatewayService_: any;
  constructor({ db }: InjectedDependencies) {
    this.db_ = db;
  }

  async authenticate(email: string, password: string) {
    return await this.db_.transaction(async (tx) => {
      const userHashedPassword = await tx
        .select({
          password: user.password,
        })
        .from(user)
        .where(eq(user.email, email));
      if (userHashedPassword[0]) {
        const passwordMatch = await this.comparePassword_(
          password,
          userHashedPassword[0].password
        );
        if (passwordMatch) {
          return (
            await this.db_
              .select({
                id: user.id,
                email: user.email,
                active: user.active,
              })
              .from(user)
              .where(eq(user.email, email))
          )[0];
        }
      }

      return false;
    });
  }

  protected async comparePassword_(password: string, hash: string) {
    const buf = Buffer.from(hash, "base64");
    return Scrypt.verify(buf, password);
  }

  async create(data: NewUser, password: string) {
    userSchema.parse(data);

    const hashedPassword = await this.hashPassword_(password);

    return await this.db_.transaction(async (tx) => {
      const hasUser = await this.db_
        .select()
        .from(user)
        .where(eq(user.email, data.email));
      if (hasUser[0]) {
        throw new Error("Email already exist");
      }
      const customerId = await this.paymentGatewayService_.createCustomer(
        data.email
      );
      const result = await tx
        .insert(user)
        .values({
          email: data.email,
          password: hashedPassword,
          sCustomerId: customerId,
        })
        .returning({
          id: user.id,
        });

      return result[0];
    });
  }
  /**
   * Hashes a password
   * @param {string} password - the value to hash
   * @return {string} hashed password
   */
  async hashPassword_(password: string): Promise<string> {
    const buf = await Scrypt.kdf(password, { logN: 1, r: 1, p: 1 });
    return buf.toString("base64");
  }
}
