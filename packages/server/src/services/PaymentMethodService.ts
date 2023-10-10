import {
  PgJsDatabaseType,
  paymentMethod,
  storePaymentMethod,
  tempAccountId,
} from "db";
import { RESOLVER } from "awilix";
import PaymentGatewayService from "./PaymentGatewayService";
import { and, eq } from "drizzle-orm";
import { CurrentStore } from "../types";
type InjectedDependencies = {
  db: PgJsDatabaseType;
  paymentGatewayService: PaymentGatewayService;
  currentStore: CurrentStore;
};
export default class PaymentMethodService {
  static [RESOLVER] = {};
  protected readonly db_: PgJsDatabaseType;
  protected readonly paymentGatewayService_: PaymentGatewayService;
  protected readonly currentStore_: CurrentStore;
  constructor({
    db,
    paymentGatewayService,
    currentStore,
  }: InjectedDependencies) {
    this.db_ = db;
    this.paymentGatewayService_ = paymentGatewayService;
    this.currentStore_ = currentStore;
  }

  async list() {
    return await this.db_.select().from(paymentMethod);
  }

  async getStorePaymentMethod(paymentMethodId: string) {
    const data = await this.db_
      .select()
      .from(storePaymentMethod)
      .where(
        and(
          eq(storePaymentMethod.paymentMethodId, paymentMethodId),
          eq(storePaymentMethod.storeId, this.currentStore_.storeId)
        )
      );

    if (
      data[0]?.connectedAccountId &&
      data[0]?.paymentMethodId === "stripe-connect"
    ) {
      const accountDetails =
        (await this.paymentGatewayService_.getConnectedAccount(
          data[0].connectedAccountId
        )) || null;

      return {
        ...data[0],
        accountDetails,
      };
    }

    return { ...data[0], accountDetails: null } || null;
  }

  async getStripeConnectLink(refresh_url: string, return_url: string) {
    const account = await this.paymentGatewayService_.createConnectedAccount();
    const result = await this.paymentGatewayService_.createConnectedAccountLink(
      account.id,
      refresh_url,
      return_url
    );

    let storePaymentMethodData = await this.db_
      .select()
      .from(storePaymentMethod)
      .where(
        and(
          eq(storePaymentMethod.storeId, this.currentStore_.storeId),
          eq(storePaymentMethod.paymentMethodId, "stripe-connect")
        )
      );
    if (!storePaymentMethodData[0]) {
      storePaymentMethodData = await this.db_
        .insert(storePaymentMethod)
        .values({
          storeId: this.currentStore_.storeId,
          paymentMethodId: "stripe-connect",
        })
        .returning();
    }
    await this.db_.insert(tempAccountId).values({
      accountId: account.id,
      storePaymentMethodId: storePaymentMethodData[0].id,
    });
    return result;
  }

  async updateAccount(accountId: string) {
    const data = await this.db_
      .select()
      .from(tempAccountId)
      .where(eq(tempAccountId.accountId, accountId));
    const tempAccount = data[0];
    if (tempAccount.storePaymentMethodId) {
      const result = await this.db_
        .update(storePaymentMethod)
        .set({
          connectedAccountId: tempAccount.accountId,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(storePaymentMethod.id, tempAccount.storePaymentMethodId))
        .returning();
      await this.db_
        .delete(tempAccountId)
        .where(eq(tempAccountId.storePaymentMethodId, result[0].id));
      return result[0];
    }
    return;
  }
}
