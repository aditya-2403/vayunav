import { Stack, Text, Button, ActionIcon } from '@mantine/core';
import { IconRadar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { UI_MESSAGES } from '../../constants/messages';

export default function StandbyConsole({ openSidebar }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Stack align="center" style={{ opacity: 0.6 }}>
        <ActionIcon variant="transparent" size="120" color="gray" className="floating-icon">
          <IconRadar size={100} stroke={1} />
        </ActionIcon>
        <Text size="xl" className="neon-text" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
          {UI_MESSAGES.STANDBY_MAIN}
        </Text>
        <Text c="dimmed">{UI_MESSAGES.STANDBY_SUB}</Text>
        <Button 
          variant="outline" 
          color="cyan" 
          mt="md" 
          hiddenFrom="sm" 
          onClick={openSidebar}
          className="pulsing-border"
          leftSection={<IconRadar size={16} />}
        >
          {UI_MESSAGES.OPEN_CONSOLE}
        </Button>
      </Stack>
    </motion.div>
  );
}
