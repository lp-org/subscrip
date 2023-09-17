"use client";
import { MailIcon, PhoneIcon, StoreIcon } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import React, { useState } from "react";
import Profile from "./StoreSetting/Profile";
import StoreCurrency from "./StoreSetting/Currency";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "../../../utils/adminClient";
import { useStoreSetting } from "./StoreSetting/useStoreSetting";

const StoreSettingPage = () => {
  return (
    <Card title="Store Settings">
      <Profile />
      <StoreCurrency />
    </Card>
  );
};

export default StoreSettingPage;
