"use client";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/admin/Pagination";

export function ServerPaginationClient({ currentPage, totalPages, totalItems, itemsPerPage }: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/admin/jobs?page=${page}`);
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
