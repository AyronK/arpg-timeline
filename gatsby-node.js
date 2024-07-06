/**
 * Why is it necessary?
 * https://www.gatsbyjs.com/docs/how-to/images-and-media/working-with-images-in-markdown/
 * https://github.com/danielmahon/gatsby-remark-relative-images/issues/61
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
