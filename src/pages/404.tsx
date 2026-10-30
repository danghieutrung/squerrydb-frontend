import { Compass } from "lucide-react";

import { Layout } from "@/components/Layout";
import { StatusMessage } from "@/components/StatusMessage";

export default function NotFound() {
  return (
    <Layout title="Page not found" showSearch={false}>
      <StatusMessage
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist. Search for a series instead."
      />
    </Layout>
  );
}
