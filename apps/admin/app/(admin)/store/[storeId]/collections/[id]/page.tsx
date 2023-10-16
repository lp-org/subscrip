import React from "react";
import CollectionForm from "../../../../../../components/view/Form/CollectionForm";
import { serverApiRequest } from "../../../../../../utils/server-client-request";
import { revalidatePath } from "next/cache";

async function getData(storeId: string, roomId: string) {
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const req = serverApiRequest(storeId);
  const data = await req.collection.get(roomId);

  return data?.data;
}

const UpdateCollections = async ({ params }) => {
  const id = params.id as string;
  revalidatePath(`/store/${params.storeId}/rooms/${params.id}`);
  const collection = await getData(params.storeId, params.id);

  return (
    <>
      <CollectionForm payload={collection} />
    </>
  );
};

export default UpdateCollections;
