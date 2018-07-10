const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

 const _ = require(`lodash`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`);
  const tagTemplate = path.resolve(`./src/templates/tags.js`);

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                path
                tags
              }
            }
          }
        }
      }
  `).then(result => {
    if (result.errors) {
      console.log(result.errors);
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;
    
    // Create post detail pages
    posts.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: blogPostTemplate,
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        });
    });

    // Tage pages:
    let tags = [];
    // Iterate through each post, putting all found tags into 'tags'
    _.each(posts, edge => {
      if (_.get(edge, "node.formatter.tags")) {
        tags = tags.concat(edge.node.frontmatter.tags);
      }
    });
    // eliminate duplicate tags
    tags = _.uniq(tags);

    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      });
    });

      resolve()
    })
  })
};
