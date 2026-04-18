import { 
  Paper, Select, Text, Center, Stack, Loader, 
  Accordion, NavLink, Box, Group, Title, ActionIcon, ScrollArea
} from '@mantine/core';
import { IconFileText, IconInfoCircle, IconStar, IconStarFilled, IconCloudStorm } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UI_MESSAGES } from '../../constants/messages';
import { useFavorites } from '../../hooks/useFavorites';
import { apiService } from '../../services/api';
import { useState, useEffect } from 'react';

export default function SidebarComponent({
  airports, airportsLoading, airportsError, selectedAirport, 
  handleAirportSelect, chartsLoading, chartsError, groupedCharts, 
  activeChart, setActiveChart, closeSidebar
}) {

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [metar, setMetar] = useState(null);
  const [metarLoading, setMetarLoading] = useState(false);

  useEffect(() => {
    if (selectedAirport) {
      setMetarLoading(true);
      apiService.getWeather(selectedAirport).then((data) => {
        setMetar(data.metar);
        setMetarLoading(false);
      });
    } else {
      setMetar(null);
    }
  }, [selectedAirport]);

  // Mantine v7 Select requires grouped data in { group, items[] } format
  const favoriteAirports = airports
    .filter(a => isFavorite(a.code))
    .map(a => ({ value: a.code, label: `${a.code} - ${a.name}` }));

  const allAirports = airports.map(a => ({ value: a.code, label: `${a.code} - ${a.name}` }));

  const airportOptions = favoriteAirports.length > 0
    ? [
        { group: '★ Quick Access Favorites', items: favoriteAirports },
        { group: 'All Airports', items: allAirports },
      ]
    : allAirports;

  return (
    <>
      <Paper p="sm" radius="md" mb="xl" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Group justify="space-between" mb={5} wrap="nowrap">
          <Text c="cyan" fw={600}>{UI_MESSAGES.LABEL_AERODROME}</Text>
          {selectedAirport && (
            <ActionIcon 
              variant="subtle" 
              color={isFavorite(selectedAirport) ? "yellow" : "gray"}
              onClick={() => toggleFavorite(selectedAirport)}
              size="sm"
            >
              {isFavorite(selectedAirport) ? <IconStarFilled size={18} /> : <IconStar size={18} />}
            </ActionIcon>
          )}
        </Group>
        <Select
          placeholder={airportsLoading ? UI_MESSAGES.LOADING_AIRPORTS : UI_MESSAGES.AWAITING_INPUT}
          data={airportOptions}
          value={selectedAirport}
          onChange={handleAirportSelect}
          searchable
          disabled={airportsLoading}
          clearable
          styles={{
            input: {
              backgroundColor: 'rgba(10, 10, 30, 0.8)',
              borderColor: 'rgba(0, 245, 255, 0.3)',
              color: '#fff',
              fontFamily: 'monospace'
            },
            dropdown: {
              backgroundColor: 'rgba(15, 15, 30, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 10, 20, 0.8)',
            },
            option: {
              fontFamily: 'monospace',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              '&[data-hovered]': {
                backgroundColor: 'rgba(157, 78, 221, 0.2)',
                color: '#fff',
              },
              '&[data-selected]': {
                backgroundColor: 'rgba(0, 245, 255, 0.2) !important',
                color: '#00f5ff !important',
                fontWeight: 600,
              }
            }
          }}
          comboboxProps={{ 
            transitionProps: { transition: 'pop-top-left', duration: 200 },
            shadow: 'xl'
          }}
        />
        {airportsError && <Text c="red" size="sm" mt="sm">{airportsError}</Text>}
      </Paper>

      <AnimatePresence mode="wait">
        {selectedAirport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Paper p="sm" radius="md" mb="xl" style={{ backgroundColor: 'rgba(15, 15, 30, 0.4)', border: '1px solid rgba(157, 78, 221, 0.2)' }}>
              <Group gap="xs" mb="xs">
                <IconCloudStorm size={18} color="#9d4edd" />
                <Text size="sm" c="gray.4" fw={600}>LIVE STATION METAR</Text>
                {metarLoading && <Loader size="xs" color="cyan" />}
              </Group>
              <ScrollArea h={60} type="auto">
                <Text size="xs" c="cyan" style={{ fontFamily: 'monospace', lineHeight: 1.4 }}>
                  {metarLoading ? "FETCHING DATA..." : metar}
                </Text>
              </ScrollArea>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedAirport && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Title order={5} mb="md" c="dimmed" style={{ letterSpacing: '1px' }}>
              {UI_MESSAGES.LABEL_DATALINKS}
            </Title>

            {chartsLoading ? (
              <Center py="xl">
                <Stack align="center" gap="xs">
                  <Loader color="violet" type="bars" />
                  <Text c="violet" size="sm" style={{ fontFamily: 'monospace' }}>
                    {UI_MESSAGES.LOADING_CHARTS}
                  </Text>
                </Stack>
              </Center>
            ) : chartsError ? (
              <Text c="red">{chartsError}</Text>
            ) : Object.keys(groupedCharts).length > 0 ? (
              <Accordion variant="separated" radius="md" defaultValue={Object.keys(groupedCharts)[0]}>
                {Object.entries(groupedCharts).map(([category, items], index) => (
                  <motion.div 
                    key={category} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Accordion.Item value={category} style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(157, 78, 221, 0.2)' }}>
                      <Accordion.Control>
                        <Group gap="xs">
                          <Text fw={600} c="gray.3">{category}</Text>
                          <Text size="xs" c="cyan">[{items.length}]</Text>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap={4}>
                          {items.map((chart, idx) => (
                            <NavLink
                              key={idx}
                              label={<Text size="sm">{chart.title}</Text>}
                              leftSection={<IconFileText size={14} color={activeChart === chart.url ? '#00f5ff' : '#9d4edd'} />}
                              active={activeChart === chart.url}
                              onClick={() => {
                                setActiveChart(chart.url);
                                closeSidebar();
                              }}
                              color="cyan"
                              variant="light"
                              style={{ borderRadius: '6px' }}
                            />
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </motion.div>
                ))}
              </Accordion>
            ) : (
              <Center py="xl"><Text c="dimmed">{UI_MESSAGES.NO_CHARTS_FOUND}</Text></Center>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Box mt="xl" pt="xl" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Group gap="xs" wrap="nowrap" align="flex-start">
          <IconInfoCircle size={16} color="gray" style={{ minWidth: 16 }} />
          <Text size="xs" c="dimmed">
            {UI_MESSAGES.DISCLAIMER}
          </Text>
        </Group>
      </Box>
    </>
  );
}
