import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface ReaderCardProps {
  reader: Reader;
}
interface Reader {
  _id: string;
  name?: string;
  username: string;
  email: string;
  userType: string;
  readAt: string;
}

const ReaderCard: React.FC<ReaderCardProps> = ({ reader }) => {
  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
      })
        .replace("about ", "")
        .replace("hours", "hrs")
        .replace("minutes", "min")
        .replace("seconds", "sec");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (reader.name)
    reader.name = reader.name.charAt(0).toUpperCase() + reader.name.slice(1);

  return (
    <motion.div
      layout="position"
      layoutId={reader._id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.98,
        transition: {
          duration: 0.1,
          ease: "easeIn",
        },
      }}
      whileHover={{
        scale: 1.01,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      className="rounded-lg bg-white dark:bg-gray-800 p-1.5 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 will-change-transform"
    >
      <motion.div
        layout="position"
        className="flex items-center gap-3 relative"
      >
        <motion.div
          layout="position"
          className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0"
        >
          <span className="text-white text-sm font-semibold">
            {reader.name?.slice(0, 2).toUpperCase() || reader.username[0]}
          </span>
        </motion.div>

        <motion.div layout="position" className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {reader.username}
          </p>
          <h3 className="font-semibold text-gray-700 dark:text-white text-sm truncate">
            {reader.name}
          </h3>
        </motion.div>

        <motion.div
          layout="position"
          className="flex items-center gap-1 shrink-0 absolute top-0 right-0"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold">
            {formatDate(reader.readAt)}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default ReaderCard;