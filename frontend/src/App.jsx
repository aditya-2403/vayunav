import { MantineProvider, createTheme } from '@mantine/core';
import Dashboard from './components/Dashboard';
import PinLockScreen from './components/PinLockScreen';
import { usePinLock } from './hooks/usePinLock';

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
  const { isUnlocked, tryUnlock, error } = usePinLock();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {isUnlocked ? <Dashboard /> : <PinLockScreen tryUnlock={tryUnlock} error={error} />}
    </MantineProvider>
  );
}

export default App;
