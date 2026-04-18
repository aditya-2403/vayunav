import { MantineProvider, createTheme } from '@mantine/core';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  primaryColor: 'cyan',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  components: {
    Paper: {
      defaultProps: {
        className: 'glass-panel',
      },
    },
    AppShell: {
      styles: {
        root: {
          backgroundColor: 'transparent',
        },
      }
    }
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Dashboard />
    </MantineProvider>
  );
}

export default App;
