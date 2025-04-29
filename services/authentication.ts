"use server";

import { supabase } from "@/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signUp = async (
  prevState: { error: string | null },
  formData: FormData
): Promise<{
  error: string | null;
}> => {
  console.log(Array(15).join("-"), "signUp", Array(15).join("-")); // SAFE TO REMOVE

  const email = formData.get("input-e-mail");
  const password = formData.get("input-password");

  if (email && password) {
    const { error } = await supabase().auth.signUp({
      email: email as string,
      password: password as string,
    });

    if (error) {
      console.error(error);
      return returnState(error.status);
    }

    revalidatePath("/");
    redirect("/");
  }

  return {
    error: "E-mail or password is incorrect.",
  };
};

const returnState = (state: number | undefined) => {
  const stateMap = new Map();
  stateMap.set(422, { error: "Weak password. At least 6 characters." });
  stateMap.set(400, { error: "E-mail invalid." });
  return stateMap.get(state) || { error: "Error. User not created." };
};
