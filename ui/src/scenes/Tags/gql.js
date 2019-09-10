import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

export const CREATE_TAG = gql`
  mutation createTag($name: String!, $description: String!) {
    createTag(name: $name, description: $description) {
      name
      description
    }
  }
`;

export const SET_TAG_PARENT = gql`
  mutation setTagParent($tagName: String!, $parentName: String) {
    setTagParent(tagName: $tagName, parentName: $parentName) {
      tagName
      parentName
    }
  }
`;

export const GET_TAGS = gql`
  {
    tags {
      id: name
      name
      description
    }
  }
`;

export const GET_TAG_TREE_DATA = gql`
  {
    tagTreeData {
      tags {
        all
        orphans
        roots
      }
      taggings {
        id
        src
        tgt
      }
    }
  }
`;
