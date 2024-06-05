import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center bg-black min-h-screen">
      <div className="mt-[15rem]">
        <SignIn />
      </div>
    </div>
  );
}