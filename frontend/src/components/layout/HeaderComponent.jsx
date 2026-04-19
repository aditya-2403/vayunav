import { useEffect, useState } from 'react';
import { Group, Title, Badge, Text, ActionIcon, Burger } from '@mantine/core';
import { IconPlane, IconClock, IconRadar, IconMoonStars } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNightMode } from '../../hooks/useNightMode';
import { UI_MESSAGES } from '../../constants/messages';

export default function HeaderComponent({ opened, toggle }) {
  const { isNightMode, toggleNightMode } = useNightMode();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="#00f5ff" />
        <motion.div className="floating-icon">
          <IconPlane size={32} color="#00f5ff" />
        </motion.div>
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Title order={2} className="neon-text" style={{ fontFamily: 'monospace', letterSpacing: '2px', lineHeight: 1 }}>
            VAYUNAV
          </Title>
          <Text size="9px" c="dimmed" style={{ fontFamily: 'monospace', letterSpacing: '1px', opacity: 0.45, lineHeight: 1, marginTop: 2 }}>
            {UI_MESSAGES.APP_VERSION}
          </Text>
        </motion.div>
        <Badge variant="outline" color="violet" ml="md" visibleFrom="xs">
          AIRAC 04/2026
        </Badge>
      </Group>
      <Group>
        <Group gap="xs" visibleFrom="xs" mr="xl">
          <IconClock size={16} color="#00f5ff" />
          <Text c="#00f5ff" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
            {time.toISOString().substring(11, 19)} UTC
          </Text>
        </Group>

        <ActionIcon 
          variant="light" 
          color={isNightMode ? "red" : "indigo"} 
          size="lg" 
          radius="xl" 
          onClick={toggleNightMode}
          title="Toggle Night Vision Mode"
          className="pulsing-border"
        >
          <IconMoonStars size={20} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
