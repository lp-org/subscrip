import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@tanstack/react-query";
import { NewRoom } from "db";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import InputError from "ui/InputError";
import { useRequest } from "../../../../../../utils/adminClient";
import CurrencyInput from "ui/Input/CurrencyInput";
import FormToolbar from "ui/FormToolbar";
import { useToast } from "ui";
import RoomForm from "../../../../../../components/view/Form/RoomForm";

const CreateRoomPage = () => {
  return <RoomForm />;
};

export default CreateRoomPage;

export const metadata = {
  title: "Create Room",
};
