import React from "react";

import AccountNav from "../components/account-nav";
import { HttpTypes } from "@medusajs/types";

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null;
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 bg-white small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-6 px-4 small:px-8 py-6 small:py-8">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              {customer && <AccountNav customer={customer} />}
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 small:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
