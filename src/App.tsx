import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import DocsLayout from '@/components/layout/DocsLayout';
import DocPage from '@/pages/DocPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<Navigate to="faq" replace />} />
        <Route path=":slug" element={<DocPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;