import { useState, useMemo } from 'react';
import { AppShell, ScrollArea, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AnimatePresence } from 'framer-motion';

import { useAirports, useCharts } from '../hooks/useCharts';
import HeaderComponent from './layout/HeaderComponent';
import SidebarComponent from './layout/SidebarComponent';
import StandbyConsole from './dashboard/StandbyConsole';
import PdfCanvas from './dashboard/PdfCanvas';

export default function Dashboard() {
  const [opened, { toggle, close, open }] = useDisclosure();
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  
  const { airports, loading: airportsLoading, error: airportsError } = useAirports();
  const { charts, loading: chartsLoading, error: chartsError } = useCharts(selectedAirport);

  // Group charts by category
  const groupedCharts = useMemo(() => {
    if (!charts) return {};
    return charts.reduce((groups, chart) => {
      const cat = chart.category || 'MISC';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(chart);
      return groups;
    }, {});
  }, [charts]);

  const handleAirportSelect = (val) => {
    setSelectedAirport(val);
    setActiveChart(null);
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 350,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="0"
    >
      <AppShell.Header className="glass-panel" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <HeaderComponent opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md" className="glass-panel" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <ScrollArea h="100%" scrollbars="y">
          <SidebarComponent 
            airports={airports}
            airportsLoading={airportsLoading}
            airportsError={airportsError}
            selectedAirport={selectedAirport}
            handleAirportSelect={handleAirportSelect}
            chartsLoading={chartsLoading}
            chartsError={chartsError}
            groupedCharts={groupedCharts}
            activeChart={activeChart}
            setActiveChart={setActiveChart}
            closeSidebar={close}
          />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence>
            {!activeChart ? (
              <StandbyConsole key="standby" openSidebar={open} />
            ) : (
              <PdfCanvas key={activeChart} activeChartUrl={activeChart} />
            )}
          </AnimatePresence>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
