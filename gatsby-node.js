/**
 * Why is it necessary?
 * https://www.gatsbyjs.com/docs/how-to/images-and-media/working-with-images-in-markdown/
 * https://github.com/danielmahon/gatsby-remark-relative-images/issues/61
 * After the PR is merge (or a fork package is created) and package version upgrade on gatsby-remark-relative-images, this code is safe to be removed.
 * https://github.com/danielmahon/gatsby-remark-relative-images/pull/64
 */
function createNodeHandler(createNodeFieldCallable, node) {
  const eligibleToBeProcessed =
    node.fileAbsolutePath && node.internal.type === `MarkdownRemark`;
  if (eligibleToBeProcessed) {
    if (node?.frontmatter) {
      createNodeFieldCallable({
        node,
        name: `frontmatter`,
        value: node.frontmatter,
      });
    }
  }
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  createNodeHandler(createNodeField, node);
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: "@babel/plugin-transform-react-jsx",
    options: {
      runtime: "automatic",
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatter {
      title: String
      description: String
      withLogo: Boolean
      duration: Int
      order: Int
    }
    
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
  `);
};
