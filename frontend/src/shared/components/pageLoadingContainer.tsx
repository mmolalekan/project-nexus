import { PageLoadingState } from "@/shared/allIcons";

export const PageLoadingContainer = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) => {
  return (
    <div>
      {isLoading ? (
        <div className="grid place-content-center h-screen w-screen">
          <PageLoadingState />
        </div>
      ) : (
        children
      )}
    </div>
  );
};
