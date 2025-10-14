import LogoComponent from "@/components/ui/logo/logo.component";
import { useAppDispatch } from "@/store/hooks";
import { signOutUser } from "@/store/thunk/auth.thunk";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BiLogOut } from "react-icons/bi";

const NavigationComponent = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = () => {
    dispatch(signOutUser());
    router.replace("/auth/login", undefined, { shallow: true });
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-base_gray mb-4">
      <div>
        <Link href="/">
          <LogoComponent
            size={36}
            showText
            variant="default"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav>
          <Link href="/stats">Stats</Link>
        </nav>
        <button
          className="text-sm text-red-500 cursor-pointer "
          onClick={handleSignOut}>
          <BiLogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default NavigationComponent;
