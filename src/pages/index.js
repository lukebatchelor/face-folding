import React from 'react';

import Layout from '../components/layout';
import App from '../components/App';

const IndexPage = () => (
  <Layout>
    <h1 style={{ textAlign: 'center' }}>Face Folding</h1>
    <p>This is a super simple face folding app!</p>
    <p>To begin, upload an image!</p>
    <App />
  </Layout>
);

export default IndexPage;
