import LoginClientPage from "../../components/auth/LoginClientPage";

type Props = {
  searchParams: Promise<{
    logout?: string;
    signup?: string;
    redirectedFrom?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = params.redirectedFrom && params.redirectedFrom.startsWith("/")
    ? params.redirectedFrom
    : "/dashboard";

  let toastMessage = "";

  if (params.logout === "success") {
    toastMessage = "Logged out successfully.";
  } else if (params.signup === "success") {
    toastMessage = "Account created successfully. You can now log in.";
  }

  return <LoginClientPage toastMessage={toastMessage} redirectTo={redirectTo} />;
}