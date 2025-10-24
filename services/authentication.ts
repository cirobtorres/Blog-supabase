"use server";

import { createServerAppClient } from "@/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const SignInOAuth = async (provider: Provider, redirectTo?: string) => {
  if (!provider) return null;

  const supabase = await createServerAppClient();

  // console.log(redirectTo);

  const { data: userData, error: userError } =
    await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: redirectTo || `http://localhost:3000/auth/callback`,
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
  prevState: AuthenticateActionStateProps,
  formData: FormData
): Promise<AuthenticateActionStateProps> => {
  const email = formData.get("floating-email-signIn");
  const password = formData.get("floating-password-signIn");

  const error: Record<string, string[]> = {};
  const supabase = await createServerAppClient();

  if (!email) (error.email ??= []).push("Email é obrigatório");
  if (!password) (error.password ??= []).push("Senha é obrigatória");

  if (Object.keys(error).length > 0) {
    return {
      ok: false,
      success: null,
      error,
      data: null,
    };
  }

  const { data, error: supabaseError } = await supabase.auth.signInWithPassword(
    {
      email: String(email),
      password: String(password),
    }
  );

  if (supabaseError) {
    console.error(supabaseError);
    if (supabaseError.status === 400)
      return {
        ok: false,
        success: null,
        error: { server: ["E-mail ou senha está incorreto"] },
        data: null,
      };
    return {
      ok: false,
      success: null,
      error: { server: ["Ocorreu algum erro. Tente mais tarde."] },
      data: null,
    };
  }

  revalidatePath("/");

  return {
    ok: true,
    success: null,
    error: {},
    data,
  };
};

export const signUp = async (
  prevState: AuthenticateActionStateProps,
  formData: FormData
): Promise<AuthenticateActionStateProps> => {
  const full_name =
    formData.get("floating-displayName-signUp")?.toString().trim() || "";
  const email = formData.get("floating-email-signUp")?.toString().trim() || "";
  const password =
    formData.get("floating-password-signUp")?.toString().trim() || "";
  const passwordConfirm =
    formData.get("floating-password-confirmation-signUp")?.toString().trim() ||
    "";

  const error: Record<string, string[]> = {};
  const supabase = await createServerAppClient();

  // -------------------- DISPLAYNAME --------------------
  if (!full_name) (error.displayName ??= []).push("O nome é obrigatório");

  if (full_name.length < 4)
    (error.displayName ??= []).push("O nome deve ter mais de 4 caracteres");

  // -------------------- EMAIL --------------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) (error.email ??= []).push("Email é obrigatório");

  if (!emailRegex.test(email)) (error.email ??= []).push("Email inválido");

  const { data: existingEmail } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingEmail) (error.email ??= []).push("Email já cadastrado");

  // --- VALIDAR PASSWORD ---
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  if (!password) (error.password ??= []).push("Senha é obrigatória");

  if (password.length < 6)
    (error.password ??= []).push("Senha deve ter mais de 6 caracteres");

  if (!passwordRegex.test(password))
    (error.password ??= []).push(
      // "Senha inválida"
      "Senha deve conter ao menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial"
    );

  if (
    password !== passwordConfirm ||
    (password === "" && passwordConfirm === "")
  ) {
    (error.password ??= []).push("Senhas devem ser iguais");
    (error.passwordConfirm ??= []).push("Senhas devem ser iguais");
  }

  // --- SE HOUVER ERROS ---
  if (Object.keys(error).length > 0) {
    return {
      ok: false,
      success: null,
      error,
      data: null,
    };
  }

  const { data, error: supabaseError } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
    options: {
      // emailRedirectTo: "/", // TODO: if confirmation link is used
      data: {
        full_name,
      },
    },
  });

  if (supabaseError) {
    console.error(supabaseError);
    if (
      supabaseError.code === "user_already_exists" &&
      supabaseError.status === 422
    ) {
      return {
        ok: false,
        success: null,
        error: { server: ["Usuário já cadastrado."] },
        data: null,
      };
    }
    return {
      ok: false,
      success: null,
      error: { server: ["Ocorreu algum erro. Tente mais tarde."] },
      data: null,
    };
  }

  revalidatePath("/");
  // redirect("/");

  return {
    ok: true,
    success: "Usuário criado com sucesso",
    error: {},
    data,
  };
};

export const signOut = async (pathname?: string) => {
  const supabase = await createServerAppClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/user")) {
      redirect("/");
    }
  }
  console.error(error);
};
