import { RouterProvider } from 'react-router-dom';
import router from './router';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toast />
    </ErrorBoundary>
  );
}

export default App;
