const Level = ({ tagging }) => {
  return tagging && tagging.level
    ? Array.from({ length: Math.floor(tagging.level / 20) })
        .map(() => "▮")
        .join("")
        .padEnd(5, "▯")
    : "—";
};

export default Level;
