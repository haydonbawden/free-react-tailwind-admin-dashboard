import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | Contract Reviewer"
        description="This is React.js SignUp Tables Dashboard page for Contract Reviewer - AI Contract Analysis"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
