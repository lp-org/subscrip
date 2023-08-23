import { PgJsDatabaseType, user } from "db";
import { RESOLVER } from "awilix";
import { and, eq } from "drizzle-orm";
import Scrypt from "scrypt-kdf";
type InjectedDependencies = {
  db: PgJsDatabaseType;
};
export default class AuthService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
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
}
