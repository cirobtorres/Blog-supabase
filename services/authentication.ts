"use server";

import {
  getDisplayNameFormDataValue,
  getEmailFormDataValue,
  getPasswordFormDataValue,
} from "@/components/Fieldsets";
import { createServerAppClient } from "@/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// const returnState = (state: number | undefined) => {
//   const stateMap = new Map();
//   stateMap.set(422, { error: "Weak password. At least 6 characters." });
//   stateMap.set(400, { error: "E-mail invalid." });
//   return stateMap.get(state) || { error: "Error. User not created." };
// };

export const SignInOAuth = async (provider: Provider) => {
  if (!provider) return null;

  const supabase = await createServerAppClient();

  const { data: userData, error: userError } =
    await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

  if (userError) {
    console.error(userError);
  }

  if (userData.url) {
    redirect(userData.url);
  }
};

export const signIn = async (
  prevState: { error: string | null },
  formData: FormData
): Promise<{
  error: string | null;
}> => {
  const email = formData.get(getEmailFormDataValue);
  const password = formData.get(getPasswordFormDataValue);

  if (email && password) {
    const supabase = await createServerAppClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: String(email),
      password: String(password),
    });

    if (error) {
      console.error(error);
      return { error: error.message };
      // return returnState(error.status);
    }

    revalidatePath("/");
    redirect("/");
  }

  return {
    error: "E-mail or password is incorrect.",
  };
};

export const signUp = async (
  prevState: { error: string | null },
  formData: FormData
): Promise<{
  error: string | null;
}> => {
  const displayName = formData.get(getDisplayNameFormDataValue);
  const email = formData.get(getEmailFormDataValue);
  const password = formData.get(getPasswordFormDataValue);

  if (!displayName) return { error: "Display name is required." };

  if (email && password) {
    const supabase = await createServerAppClient();

    const { error } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        // emailRedirectTo: "/", // TODO: if confirmation link is used
        data: {
          displayName,
        },
      },
    });

    if (error) {
      console.error(error);
      return { error: error.message };
      // return returnState(error.status);
    }

    revalidatePath("/");
    redirect("/");
  }

  return {
    error: "E-mail or password is incorrect.",
  };
};

export const signOut = async () => {
  const supabase = await createServerAppClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
};
