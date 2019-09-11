import { getTreeFromFlatData } from "react-sortable-tree";
import "react-sortable-tree/style.css";

export default ({ tags, taggings }) =>
  getTreeFromFlatData({
    flatData: tags.all.map(name => ({ title: name })),
    getKey: node => node.title,
    getParentKey: node => {
      const tagging = taggings.find(t => t.tgt === node.title);
      return tagging ? tagging.src : null;
    },
    rootKey: null
  });
