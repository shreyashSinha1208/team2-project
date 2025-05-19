import Link from "next/link";
import Image from "next/image";
interface ZCardProps {
  name: string;
  path: string;
  image: string;
  description: string;
}
export const ZCard: React.FC<ZCardProps> = ({
  name,
  path,
  image,
  description,
}) => (
  <Link
    href={path}
    className="flex items-center justify-center flex-wrap gap-8 p-4 max-w-[440px]"
  >
    <div className="max-w-[72vw]">
      <div className="relative bg-gray-100 dark:bg-gray-900 p-3 rounded-[14px] w-[360px] h-[280px] transition-colors duration-300 overflow-hidden z-0">
        <div className="absolute right-4 top-3 z-20">
          <h2 className="text-lg text-gray-900 dark:text-gray-200 px-2 py-1 font-bold bg-blue-200 dark:bg-blue-700 rounded-[14px] relative right-[-5px] max-w-[240px] flex items-center justify-center text-center transition-colors duration-300">
            {name}
            <div className="absolute w-[105%] h-[120%] bg-gray-100 dark:bg-gray-900 -z-10 top-0 right-0 rounded-bl-lg before:w-7 before:aspect-square before:bg-transparent before:-left-7 before:rounded-full before:shadow-[14px_-14px_0_#f3f4f6] dark:before:shadow-[14px_-14px_0_#111827] before:top-0 before:absolute after:w-7 after:aspect-square after:bg-transparent after:-right-0 after:rounded-full after:shadow-[14px_-14px_0_#f3f4f6] dark:after:shadow-[14px_-14px_0_#111827] after:-bottom-7 after:absolute before:transition-colors after:transition-colors transition-colors duration-300"></div>
          </h2>
        </div>
        <div className="relative w-full h-full z-10 overflow-hidden">
          <Image
            src={image}
            alt={name}
            className="object-cover h-[280px] rounded"
            width={360}
            height={280}
          />
        </div>
        <div className="absolute w-[200px] h-[80px] bottom-3 left-3 z-30">
          <div className="relative w-full h-full">
            <div className="absolute w-[105%] h-[110%] bg-gray-100 dark:bg-gray-900 bottom-0 left-0 rounded-tr-lg before:w-7 before:aspect-square before:bg-transparent before:left-0 before:rounded-full before:shadow-[-14px_14px_0_#f3f4f6] dark:before:shadow-[-14px_14px_0_#111827] before:-top-7 before:absolute after:w-7 after:aspect-square after:bg-transparent after:-right-7 after:rounded-full after:shadow-[-14px_14px_0_#f3f4f6] dark:after:shadow-[-14px_14px_0_#111827] after:bottom-0 after:absolute after:transition-colors before:transition-colors transition-colors duration-300"></div>
            <div className="relative text-xs bg-blue-200 dark:bg-blue-700 text-gray-900 dark:text-gray-200 w-full h-full rounded-[14px] px-2 py-1 z-10 text-center flex items-center justify-center transition-colors duration-300">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);
