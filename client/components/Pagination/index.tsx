import { ArrowLeft, ArrowRight } from "@/public/icons";

const Pagination = () => {
  return (
    <div className="flex mt-4 justify-between items-center">
      <div className="text-sm text-primary-500">
        Showing 9 of 10 <span className="xl:hidden">PVP</span>
        <span className="hidden xl:inline">tournaments</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className={`w-8 h-8 bg-primary-550 cursor-pointer rounded-sm border border-primary-150 flex justify-center items-center`}
        >
          <ArrowLeft />
        </div>
        {[1, 2].map((item, index) => (
          <div
            key={item}
            className={`w-8 h-8 cursor-pointer rounded-sm border flex justify-center items-center ${
              index === 0 ? "border-secondary-100" : "border-primary-150"
            }`}
          >
            <div className="text-primary-500 text-sm">{item}</div>
          </div>
        ))}
        <div
          className={`w-8 h-8 cursor-pointer rounded-sm border border-primary-150 flex justify-center items-center`}
        >
          <ArrowRight />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
