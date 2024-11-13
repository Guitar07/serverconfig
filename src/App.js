import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Cpu, Award } from 'lucide-react';
import logo from './assets/images/logo.png';
import serverImage from './assets/images/server.png';
import './index.css';

const isDevelopment = process.env.NODE_ENV === 'development';

// Remove overflow: hidden to fix scrolling issue
const style = document.createElement('style');
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    background: transparent !important;
  }
`;
document.head.appendChild(style);

const ServerConfigurator = () => {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price) => {
    return `£${price.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Expanded state to include all configuration options
  const [selectedOptions, setSelectedOptions] = useState({
    chassis: '',
    bezel: 'no-bezel',
    tpmModule: 'no-tpm',
    processor: '',
    processorCount: 1,
    memory: '',
    memoryCount: 1,
    raidController: '',
    bossController: 'none',
    systemDrives: [],
    driveQuantities: {},
    idrac: 'express',
    lan: 'broadcom5720',
    ocp: 'none',
    pcie1: 'none',
    pcie2: 'none',
    powerSupply: '',
    powerSupplyCount: 1,
    rackmountKit: 'none',
    windowsServer: 'none',
    windowsServerCount: 1,
    windowsCals: [],
    warranty: '3yr-nbd'
  });

  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Configuration Options
  const chassisOptions = [
    { id: 'diskless', name: 'Diskless Config - No HDD/SSD', price: 0 },
    { id: '4way-3.5', name: '4 Way 3.5" Chassis', price: 0 },
    { id: '8way-2.5', name: '8 Way 2.5" Chassis', price: 0 },
    { id: '10way-2.5-nvme', name: '10 Way 2.5" NVMe Chassis', price: 0 }
  ];

  const bezelOptions = [
    { id: 'no-bezel', name: 'No Front Bezel Required', price: 0 },
    { id: 'bezel', name: 'Add Front Bezel', price: 23 }
  ];

  const tpmOptions = [
    { id: 'no-tpm', name: 'No TPM Module Required', price: 0 },
    { id: 'tpm', name: 'Add TPM Module', price: 32 }
  ];

  const processors = [
    { id: '4309Y', name: 'Intel Xeon Silver 4309Y 8C/16T 2.80GHz 12M 105W', cores: 8, price: 375.00 },
    { id: '5315Y', name: 'Intel Xeon Gold 5315Y 8C/16T 3.20GHz 12M 140W', cores: 8, price: 845.00 },
    { id: '6334', name: 'Intel Xeon Gold 6334 8C/16T 3.60GHz 18M 165W', cores: 8, price: 1170.00 },
    { id: '4310', name: 'Intel Xeon Silver 4310 12C/24T 2.10GHz 18M 120W', cores: 12, price: 350.00 },
    { id: '5317', name: 'Intel Xeon Gold 5317 12C/24T 3.00GHz 18M 150W', cores: 12, price: 915.00 },
    { id: '4314', name: 'Intel Xeon Silver 4314 16C/32T 2.40GHz 24M 135W', cores: 16, price: 485.00 },
    { id: '6326', name: 'Intel Xeon Gold 6326 16C/32T 2.90GHz 24M 185W', cores: 16, price: 860.00 },
    { id: '4316', name: 'Intel Xeon Silver 4316 20C/40T 2.30GHz 30M 150W', cores: 20, price: 725.00 },
    { id: '5318N', name: 'Intel Xeon Gold 5318N 24C/48T 2.10GHz 36M 150W', cores: 24, price: 595.00 },
    { id: '5318Y', name: 'Intel Xeon Gold 5318Y 24C/48T 2.10GHz 36M 165W', cores: 24, price: 800.00 },
    { id: '5320', name: 'Intel Xeon Gold 5320 26C/52T 2.20GHz 39M 185W', cores: 26, price: 925.00 },
    { id: '6330', name: 'Intel Xeon Gold 6330 28C/56T 2.00GHz 42M 205W', cores: 28, price: 725.00 },
    { id: '6330N', name: 'Intel Xeon Gold 6330N 28C/56T 2.20GHz 42M 165W', cores: 28, price: 1375.00 },
    { id: '6338', name: 'Intel Xeon Gold 6338 32C/64T 2.00GHz 48M 205W', cores: 32, price: 1175.00 },
    { id: '6338N', name: 'Intel Xeon Gold 6338N 32C/64T 2.20GHz 48M 185W', cores: 32, price: 1245.00 }
  ].sort((a, b) => a.cores - b.cores);

  const memoryOptions = [
    { id: '16GB', name: '16GB PC4-3200AA-R DDR4 2Rx8 3200MHz ECC', price: 40.00 },
    { id: '32GB', name: '32GB PC4-3200AA-R DDR4 2Rx4 3200MHz ECC', price: 80.00 },
    { id: '64GB', name: '64GB PC4-3200AA-R DDR4 2Rx4 3200MHz ECC', price: 160.00 },
    { id: '128GB', name: '128GB PC4-3200AA-LR DDR4 4DRx4 3200MHz ECC', price: 480.00 }
  ];

  const raidControllerOptions = [
    { id: 'none', name: 'No Raid Controller for Diskless Chassis', price: 0.00 },
    { id: 'perc-s150', name: 'PERC S150 NVMe Raid Controller', price: 0.00 },
    { id: 'perc-h355i', name: 'PERC H355i Front RAID Controller', price: 155.00 },
    { id: 'perc-h355', name: 'PERC H355 Front RAID Controller', price: 200.00 },
    { id: 'perc-h755', name: 'PERC H755 Front RAID Controller with 8GB Cache', price: 350.00 }
  ];

  const bossControllerOptions = [
    { id: 'none', name: 'No Boss Controller', price: 0.00 },
    { id: 'boss-240', name: 'Dell Boss Controller with 2 x 240GB M.2. SATA SSD', price: 130.00 },
    { id: 'boss-480', name: 'Dell Boss Controller with 2 x 480GB M.2. SATA SSD', price: 220.00 }
  ];

  const systemDrives = {
    '3.5inch': [
      { id: '1tb-sata-3.5', name: '1TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 25.00 },
      { id: '2tb-sas-3.5', name: '2TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 55.00 },
      { id: '4tb-sas-3.5', name: '4TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 85.00 },
      { id: '8tb-sas-3.5', name: '8TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 145.00 },
      { id: '12tb-sas-3.5', name: '12TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 245.00 },
      { id: '12tb-sata-3.5', name: '12TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 175.00 },
      { id: '16tb-sas-3.5', name: '16TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 340.00 },
      { id: '16tb-sata-3.5', name: '16TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 155.00 },
      { id: '18tb-sas-3.5', name: '18TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 395.00 },
      { id: '18tb-sata-3.5', name: '18TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 295.00 },
      { id: '20tb-sas-3.5', name: '20TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 445.00 },
      { id: '22tb-sas-3.5', name: '22TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 570.00 },
      { id: '22tb-sata-3.5', name: '22TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 490.00 }
    ],
    '2.5inch': [
      { id: '600gb-sas-10k', name: '600GB 10K, 2.5" SAS, 12G Hard Drive', price: 40.00 },
      { id: '600gb-sas-15k', name: '600GB 15K, 2.5" SAS, 12G Hard Drive', price: 100.00 },
      { id: '900gb-sas-15k', name: '900GB 15K, 2.5" SAS, 12G Hard Drive', price: 175.00 },
      { id: '1tb-sas-2.5', name: '1TB 7.2K, 2.5" SAS, 12G Hard Drive', price: 90.00 },
      { id: '1tb-sata-2.5', name: '1TB 7.2K, 2.5" SATA, 6G Hard Drive', price: 45.00 },
      { id: '1.2tb-sas-10k', name: '1.2TB 10K, 2.5" SAS, 12G Hard Drive', price: 90.00 },
      { id: '2tb-sas-2.5', name: '2TB 7.2K, 2.5" SAS, 12G Hard Drive', price: 200.00 },
      { id: '2.4tb-sas-10k', name: '2.4TB 10K, 2.5" SAS, 12G Hard Drive', price: 180.00 },
      { id: '960gb-sas-ssd', name: '960GB 2.5" SAS, 12G SSD Drive', price: 250.00 },
      { id: '1.6tb-sas-ssd', name: '1.6TB 2.5" SAS, 12G SSD Drive', price: 325.00 },
      { id: '1.92tb-sas-ssd', name: '1.92TB 2.5" SAS, 12G SSD Drive', price: 325.00 },
      { id: '3.84tb-sas-ssd', name: '3.84TB 2.5" SAS, 12G SSD Drive', price: 495.00 },
      { id: '7.68tb-sas-ssd', name: '7.68TB 2.5" SAS, 12G SSD Drive', price: 900.00 },
      { id: '480gb-sata-ssd', name: '480GB 2.5" SATA, 6G SSD Drive', price: 125.00 },
      { id: '960gb-sata-ssd', name: '960GB 2.5" SATA, 6G SSD Drive', price: 225.00 },
      { id: '1.92tb-sata-ssd', name: '1.92TB 2.5" SATA, 6G SSD Drive', price: 250.00 },
      { id: '3.84tb-sata-ssd', name: '3.84TB 2.5" SATA, 6G SSD Drive', price: 375.00 }
    ],
    'nvme': [
      { id: '960gb-nvme', name: '960GB 2.5" NVMe, Gen4 SSD Drive', price: 145.00 },
      { id: '1.6tb-nvme', name: '1.6TB 2.5" NVMe, Gen4 SSD Drive', price: 245.00 },
      { id: '1.92tb-nvme', name: '1.92TB 2.5" NVMe, Gen4 SSD Drive', price: 345.00 },
      { id: '3.2tb-nvme', name: '3.2TB 2.5" NVMe, Gen4 SSD Drive', price: 395.00 },
      { id: '3.84tb-nvme', name: '3.84TB 2.5" NVMe, Gen4 SSD Drive', price: 445.00 },
      { id: '6.4tb-nvme', name: '6.4TB 2.5" NVMe, Gen4 SSD Drive', price: 540.00 },
      { id: '7.68tb-nvme', name: '7.68TB 2.5" NVMe, Gen4 SSD Drive', price: 695.00 },
      { id: '15.36tb-nvme', name: '15.36TB 2.5" NVMe, Gen4 SSD Drive', price: 1099.00 }
    ]
  };

  const idracOptions = [
    { id: 'express', name: 'iDRAC9, Express 15G', price: 0.00 },
    { id: 'enterprise', name: 'iDRAC9, Enterprise 15G', price: 78.00 },
    { id: 'datacenter', name: 'iDRAC9 Datacentre 15G', price: 190.00 },
    { id: 'datacenter-advance', name: 'iDRAC9 Datacenter 15G with OpenManage Enterprise Advance+', price: 385.00 }
  ];

  const lanOptions = [
    { id: 'broadcom5720', name: 'Broadcom 5720 Dual Port 1GbE Base-T (RJ45) NIC', price: 0.00 }
  ];

  const ocpOptions = [
    { id: 'none', name: 'No OCP NIC', price: 0.00, category: 'none' },
    // 1Gbps Base-T
    { id: 'broadcom-5720-quad', name: 'Broadcom 5720 1GbE Base-T (RJ45) Quad Port OCP 3.0 NIC', price: 90.00, category: '1Gbps' },
    { id: 'intel-i350-quad', name: 'Intel i350 1GbE Base-T (RJ45) Quad Port OCP 3.0 NIC', price: 90.00, category: '1Gbps' },
    // 10Gbps Base-T
    { id: 'broadcom-57416', name: 'Broadcom 57416 10GbE Base-T (RJ45) Dual Port OCP 3.0 NIC', price: 160.00, category: '10Gbps' },
    { id: 'intel-x710-t2l', name: 'Intel X710-T2L 10GbE Base-T (RJ45) Dual Port OCP 3.0 NIC', price: 190.00, category: '10Gbps' },
    { id: 'intel-x710-t4', name: 'Intel X710-T4 10GbE Base-T (RJ45) Quad Port OCP NIC', price: 380.00, category: '10Gbps' },
    { id: 'broadcom-57454', name: 'Broadcom 57454 10GbE Base-T (RJ45) Quad Port OCP 3.0 NIC', price: 380.00, category: '10Gbps' },
    // 10Gbps SFP+
    { id: 'broadcom-57412-sfp', name: 'Broadcom 57412 10Gb SFP+ Dual Port OCP 3.0 NIC', price: 120.00, category: 'SFP+' },
    { id: 'marvell-41132', name: 'Marvell FastLinQ 10Gb SFP+ 41132 Dual Port OCP NIC', price: 245.00, category: 'SFP+' },
    { id: 'intel-x710-da2', name: 'Intel X710-DA2 10GB SFP+ Dual Port OCP 3.0 NIC', price: 180.00, category: 'SFP+' },
    { id: 'intel-x710-da4', name: 'Intel X710-DA4 10GB SFP+ Quad Port OCP 3.0 NIC', price: 360.00, category: 'SFP+' },
    // 25Gbps SFP28
    { id: 'broadcom-57414', name: 'Broadcom 57414 25Gb SFP28 Dual Port OCP 3.0 NIC', price: 160.00, category: 'SFP28' },
    { id: 'broadcom-57504', name: 'Broadcom 57504 25Gb SFP28 Quad Port OCP 3.0 NIC', price: 280.00, category: 'SFP28' }
  ];

  const pcieSlotOptions = [
    { id: 'none', name: 'No Additional NIC', price: 0.00, category: 'none' },
    // 1Gbps Base-T
    { id: 'broadcom-5719', name: 'Broadcom 5719 1Gb RJ45 Quad Port PCIe NIC', price: 35.00, category: '1Gbps' },
    { id: 'intel-i350-pcie', name: 'Intel i350 1Gb RJ45 Quad Port PCIe', price: 25.00, category: '1Gbps' },
    // 10Gbps Base-T
    { id: 'broadcom-57416-pcie', name: 'Broadcom 57416 10Gb RJ45 Dual Port PCIe NIC', price: 145.00, category: '10Gbps' },
    { id: 'intel-x710-t2l-pcie', name: 'Intel X710-T2L 10Gb RJ45 Dual Port PCIe NIC', price: 170.00, category: '10Gbps' },
    { id: 'intel-x710-t4-pcie', name: 'Intel X710-T4 10Gb RJ45 Quad Port PCIe NIC', price: 395.00, category: '10Gbps' },
    // Other options including HBA
    { id: 'dell-sas12e', name: 'Dell SAS12/E Direct Attached HBA', price: 140.00, category: 'HBA' },
    { id: 'dell-perc-h840', name: 'Dell PERC H840 HBA Card', price: 295.00, category: 'HBA' },
    { id: 'qlogic-2692', name: 'QLogic 2692 Dual Port FC16 16GB Fibre Channel HBA', price: 245.00, category: 'HBA' },
    { id: 'qlogic-2772', name: 'QLogic 2772 Dual Port FC32 32GB Fibre Channel HBA', price: 795.00, category: 'HBA' },
    { id: 'emulex-lpe36002', name: 'Emulex LPe36002 Dual Port FC64 64GB Fibre Channel HBA', price: 1595.00, category: 'HBA' }
  ];

  const powerSupplyOptions = [
    { id: '600w', name: 'Dell Platinum EPP RPSU 600W 100-240V (50/60Hz)', price: 140.00 },
    { id: '800w', name: 'Dell Platinum EPP RPSU 800W 100-240V (50/60Hz)', price: 160.00 },
    { id: '1400w', name: 'Dell Platinum EPP RPSU 1400W 100-240V (50/60Hz)', price: 200.00 },
    { id: '1100w', name: 'Dell Titanium EPP RPSU 1100W 100-240V (50/60Hz)', price: 220.00 },
    { id: '1800w', name: 'Dell Titanium ERP RPSU 1800W 200-240V (50/60Hz)', price: 240.00 }
  ];

  const rackmountKitOptions = [
    { id: 'none', name: 'No Rack kit', price: 0.00 },
    { id: 'b6', name: 'Dell B6 Sliding Rackmount Kit', price: 48.00 },
    { id: 'b6-cma', name: 'Dell B6 Sliding Rackmount Kit with Cable Management Arm', price: 96.00 }
  ];

  const windowsServerOptions = [
    // Standard Edition
    { id: '2022-std-16', name: 'Windows Server 2022 Standard, 16 Core License, 2VMs', price: 586.00, edition: 'standard' },
    { id: '2022-std-2', name: 'Windows Server 2022 Standard, 2 Core License', price: 74.00, edition: 'standard' },
    { id: '2019-std-16', name: 'Windows Server 2019 Standard, 16 Core License, 2VMs', price: 544.00, edition: 'standard' },
    { id: '2019-std-2', name: 'Windows Server 2019 Standard, 2 Core License', price: 68.00, edition: 'standard' },
    // Datacenter Edition
    { id: '2022-dc-16', name: 'Windows Server 2022 Datacentre, 16 Core License, Unlimited VMs', price: 3397.00, edition: 'datacenter' },
    { id: '2019-dc-16', name: 'Windows Server 2019 Datacentre, 16 Core License, Unlimited VMs', price: 3203.00, edition: 'datacenter' }
  ];

  const windowsCalOptions = [
    { id: '2022-rdu', name: 'Windows Server 2022 Remote Desktop User CAL', price: 84.00 },
    { id: '2022-rdd', name: 'Windows Server 2022 Remote Desktop Device CAL', price: 84.00 },
    { id: '2022-user', name: 'Windows Server 2022 User CAL', price: 28.00 },
    { id: '2022-device', name: 'Windows Server 2022 Device CAL', price: 23.00 },
    { id: '2019-rdu', name: 'Windows Server 2019 Remote Desktop User CAL', price: 62.00 },
    { id: '2019-rdd', name: 'Windows Server 2019 Remote Desktop Device CAL', price: 62.00 },
    { id: '2019-user', name: 'Windows Server 2019 User CAL', price: 24.00 },
    { id: '2019-device', name: 'Windows Server 2019 Device CAL', price: 20.00 }
  ];

  const warrantyOptions = [
    { id: '3yr-nbd', name: '3Yrs NBD Engineer Onsite Warranty', price: 0.00 },
    { id: '5yr-nbd', name: '5Yrs NBD Engineer Onsite Warranty', price: 375.00 },
    { id: '3yr-mission', name: '3Yrs Mission Critical 4Hrs & 24/7 Onsite Warranty', price: 360.00 },
    { id: '5yr-mission', name: '5Yrs Mission Critical 4Hrs & 24/7 Onsite Warranty', price: 780.00 }
  ];

  const basePrice = 1500.00;

  const getAvailableDrives = (chassisType) => {
    switch (chassisType) {
      case '4way-3.5':
        return {
          maxDrives: 4,
          drives: [...systemDrives['3.5inch'], ...systemDrives['2.5inch']]
        };
      case '8way-2.5':
        return {
          maxDrives: 8,
          drives: systemDrives['2.5inch']
        };
      case '10way-2.5-nvme':
        return {
          maxDrives: 10,
          drives: systemDrives['nvme']
        };
      default:
        return {
          maxDrives: 0,
          drives: []
        };
    }
  };

  const getValidMemoryQuantities = (cpuCount) => {
    if (cpuCount === 1) {
      return [1, 2, 4, 6, 8];
    } else {
      return [2, 4, 6, 8, 12, 16];
    }
  };

  const getRaidControllerOptions = (chassisType) => {
    if (chassisType === 'diskless') {
      return raidControllerOptions.filter(option => option.id === 'none');
    } else if (chassisType === '10way-2.5-nvme') {
      return raidControllerOptions.filter(option => option.id === 'perc-s150');
    }
    return raidControllerOptions;
  };

  const validateConfiguration = () => {
    const errors = {};

    // Required selections
    if (!selectedOptions.chassis) errors.chassis = 'Chassis selection is required';
    if (!selectedOptions.processor) errors.processor = 'Processor selection is required';
    if (!selectedOptions.memory) errors.memory = 'Memory selection is required';
    if (!selectedOptions.raidController) errors.raidController = 'RAID Controller selection is required';
    if (!selectedOptions.powerSupply) errors.powerSupply = 'Power Supply selection is required';
    if (!selectedOptions.warranty) errors.warranty = 'Warranty selection is required';

    // Memory validation
    const validMemoryQuantities = getValidMemoryQuantities(selectedOptions.processorCount);
    if (!validMemoryQuantities.includes(selectedOptions.memoryCount)) {
      errors.memoryCount = `Invalid memory quantity for ${selectedOptions.processorCount} CPU configuration`;
    }

    // Drive quantity validation
    const availableDrives = getAvailableDrives(selectedOptions.chassis);
    const totalDrives = Object.values(selectedOptions.driveQuantities).reduce((a, b) => a + b, 0);
    if (totalDrives > availableDrives.maxDrives) {
      errors.drives = `Maximum ${availableDrives.maxDrives} drives allowed for this chassis`;
    }

    // BOSS Controller validation
    if (selectedOptions.bossController !== 'none' && selectedOptions.pcie1 !== 'none') {
      errors.pcie1 = 'First PCIe slot is reserved for BOSS Controller';
    }

    return errors;
  };

  const calculateSubtotal = () => {
    let total = basePrice;

    // Add chassis components
    const bezel = bezelOptions.find(b => b.id === selectedOptions.bezel);
    if (bezel) total += bezel.price;

    const tpm = tpmOptions.find(t => t.id === selectedOptions.tpmModule);
    if (tpm) total += tpm.price;

    // Add processor
    if (selectedOptions.processor) {
      const processor = processors.find(p => p.id === selectedOptions.processor);
      if (processor) {
        total += processor.price * selectedOptions.processorCount;
      }
    }

    // Add memory
    if (selectedOptions.memory) {
      const memory = memoryOptions.find(m => m.id === selectedOptions.memory);
      if (memory) {
        total += memory.price * selectedOptions.memoryCount;
      }
    }

    // Add storage components
    if (selectedOptions.raidController) {
      const controller = raidControllerOptions.find(r => r.id === selectedOptions.raidController);
      if (controller) total += controller.price;
    }

    if (selectedOptions.bossController) {
      const boss = bossControllerOptions.find(b => b.id === selectedOptions.bossController);
      if (boss) total += boss.price;
    }

    // Add system drives
    Object.entries(selectedOptions.driveQuantities).forEach(([driveId, quantity]) => {
      const drive = [...systemDrives['3.5inch'], ...systemDrives['2.5inch'], ...systemDrives['nvme']]
        .find(d => d.id === driveId);
      if (drive) total += drive.price * quantity;
    });

    // Add networking components
    if (selectedOptions.ocp !== 'none') {
      const ocp = ocpOptions.find(o => o.id === selectedOptions.ocp);
      if (ocp) total += ocp.price;
    }

    if (selectedOptions.pcie1 !== 'none' && !selectedOptions.bossController) {
      const pcie1 = pcieSlotOptions.find(p => p.id === selectedOptions.pcie1);
      if (pcie1) total += pcie1.price;
    }

    if (selectedOptions.pcie2 !== 'none') {
      const pcie2 = pcieSlotOptions.find(p => p.id === selectedOptions.pcie2);
      if (pcie2) total += pcie2.price;
    }

    // Add power supply
    if (selectedOptions.powerSupply) {
      const psu = powerSupplyOptions.find(p => p.id === selectedOptions.powerSupply);
      if (psu) total += psu.price * selectedOptions.powerSupplyCount;
    }

    // Add rackmount kit
    if (selectedOptions.rackmountKit !== 'none') {
      const rackmount = rackmountKitOptions.find(r => r.id === selectedOptions.rackmountKit);
      if (rackmount) total += rackmount.price;
    }

    // Add Windows Server license
    if (selectedOptions.windowsServer !== 'none') {
      const license = windowsServerOptions.find(w => w.id === selectedOptions.windowsServer);
      if (license) total += license.price * selectedOptions.windowsServerCount;
    }

    // Add Windows CALs
    selectedOptions.windowsCals.forEach(calEntry => {
      const cal = windowsCalOptions.find(c => c.id === calEntry.calId);
      if (cal) {
        total += cal.price * calEntry.quantity;
      }
    });

    // Add warranty
    if (selectedOptions.warranty) {
      const warranty = warrantyOptions.find(w => w.id === selectedOptions.warranty);
      if (warranty) total += warranty.price;
    }

    return total * quantity;
  };

  const handleOptionChange = (category, value) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev, [category]: value };

      // Handle special cases
      if (category === 'chassis') {
        // Reset drives when chassis changes
        newOptions.driveQuantities = {};
        // Set appropriate RAID controller
        if (value === 'diskless') {
          newOptions.raidController = 'none';
        } else if (value === '10way-2.5-nvme') {
          newOptions.raidController = 'perc-s150';
        }
      }

      if (category === 'bossController') {
        // Reset PCIe1 if BOSS controller is selected
        if (value !== 'none') {
          newOptions.pcie1 = 'none';
        }
      }

      return newOptions;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateConfiguration();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Proceed with submission
      console.log('Configuration submitted:', selectedOptions);
      // Add your submission logic here
    }
  };

  // Effects for validation and dependencies
  useEffect(() => {
    // Validate memory configuration when CPU count changes
    if (selectedOptions.processorCount === 1 && selectedOptions.memoryCount > 8) {
      handleOptionChange('memoryCount', 8);
    } else if (selectedOptions.processorCount === 2 && selectedOptions.memoryCount < 2) {
      handleOptionChange('memoryCount', 2);
    }
  }, [selectedOptions.processorCount]);

  return (
    <div className={`w-full h-full ${isDevelopment ? 'overflow-y-auto' : 'overflow-y-auto'}`}>
      <div className="relative text-center mb-10">
        <div className="relative w-full h-64 bg-gradient-to-r from-blue-50 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={serverImage}
            alt="Dell R650XS Server"
            className="w-4/5 h-auto object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-800 to-transparent text-white text-5xl font-normal text-center">
            Dell PowerEdge R650XS 1U Rackmount Server
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Server style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>Enterprise Grade</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <HardDrive style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>High Performance</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Cpu style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>Intel Xeon CPU</span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Award style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>Warranty from 3 Years</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-[#1881AE]">Customise Your Server</h2>
          <form onSubmit={handleSubmit}>
            {/* Chassis Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                Chassis Configuration*
              </label>
              <select
                className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                  validationErrors.chassis ? 'border-2 border-red-500' : ''
                }`}
                value={selectedOptions.chassis}
                onChange={(e) => handleOptionChange('chassis', e.target.value)}
                required
              >
                <option value="">Select Chassis</option>
                {chassisOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {validationErrors.chassis && (
                <p className="mt-1 text-red-500 text-sm">{validationErrors.chassis}</p>
              )}
            </div>

            {/* Bezel Option */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                Front Bezel
              </label>
              <select
                className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                value={selectedOptions.bezel}
                onChange={(e) => handleOptionChange('bezel', e.target.value)}
              >
                {bezelOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} (+{formatPrice(option.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* TPM Module */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                TPM Module
              </label>
              <select
                className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                value={selectedOptions.tpmModule}
                onChange={(e) => handleOptionChange('tpmModule', e.target.value)}
              >
                {tpmOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} (+{formatPrice(option.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Processor Selection */}
            <div className="mb-8">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-lg font-medium mb-2">
                    Processor Selection*
                  </label>
                  <select
                    className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                      validationErrors.processor ? 'border-2 border-red-500' : ''
                    }`}
                    value={selectedOptions.processor}
                    onChange={(e) => handleOptionChange('processor', e.target.value)}
                    required
                  >
                    <option value="">Select Processor</option>
                    {processors.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} (+{formatPrice(option.price)})
                      </option>
                    ))}
                  </select>
                  {validationErrors.processor && (
                    <p className="mt-1 text-red-500 text-sm">{validationErrors.processor}</p>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-lg font-medium mb-2">
                    QTY 1-2
                  </label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.processorCount}
                    onChange={(e) => handleOptionChange('processorCount', parseInt(e.target.value))}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Memory Configuration */}
            <div className="mb-8">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-lg font-medium mb-2">
                    Memory Configuration*
                  </label>
                  <select
                    className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                      validationErrors.memory ? 'border-2 border-red-500' : ''
                    }`}
                    value={selectedOptions.memory}
                    onChange={(e) => handleOptionChange('memory', e.target.value)}
                    required
                  >
                    <option value="">Select Memory</option>
                    {memoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} (+{formatPrice(option.price)} per module)
                      </option>
                    ))}
                  </select>
                  {validationErrors.memory && (
                    <p className="mt-1 text-red-500 text-sm">{validationErrors.memory}</p>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-lg font-medium mb-2">
                    QTY {selectedOptions.processorCount === 1 ? '1-8' : '2-16'}
                  </label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.memoryCount}
                    onChange={(e) => handleOptionChange('memoryCount', parseInt(e.target.value))}
                  >
                    {getValidMemoryQuantities(selectedOptions.processorCount).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              {validationErrors.memoryCount && (
                <p className="mt-1 text-red-500 text-sm">{validationErrors.memoryCount}</p>
              )}
            </div>

            {/* RAID Controller */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                RAID Controller*
              </label>
              <select
                className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                  validationErrors.raidController ? 'border-2 border-red-500' : ''
                }`}
                value={selectedOptions.raidController}
                onChange={(e) => handleOptionChange('raidController', e.target.value)}
                required
              >
                <option value="">Select RAID Controller</option>
                {getRaidControllerOptions(selectedOptions.chassis).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : ''}
                  </option>
                ))}
              </select>
              {validationErrors.raidController && (
                <p className="mt-1 text-red-500 text-sm">{validationErrors.raidController}</p>
              )}
            </div>

            {/* BOSS Controller */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                BOSS Controller for O/S
              </label>
              <select
                className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                value={selectedOptions.bossController}
                onChange={(e) => handleOptionChange('bossController', e.target.value)}
              >
                {bossControllerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* System Drives */}
            {selectedOptions.chassis !== 'diskless' && (
              <div className="mb-8">
                <label className="block text-lg font-medium mb-2">
                  System Drives
                </label>
                <div className="space-y-4">
                  {getAvailableDrives(selectedOptions.chassis).drives.map((drive) => (
                    <div key={drive.id} className="flex items-center gap-4">
                      <div className="flex-grow">
                        <label className="text-sm">{drive.name}</label>
                      </div>
                      <select
                        className="w-24 p-2 rounded-md bg-gray-100"
                        value={selectedOptions.driveQuantities[drive.id] || 0}
                        onChange={(e) => {
                          const newQuantities = {
                            ...selectedOptions.driveQuantities,
                            [drive.id]: parseInt(e.target.value)
                          };
                          if (parseInt(e.target.value) === 0) {
                            delete newQuantities[drive.id];
                          }
                          handleOptionChange('driveQuantities', newQuantities);
                        }}
                      >
                        {Array.from({ length: getAvailableDrives(selectedOptions.chassis).maxDrives + 1 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                      <span className="w-32 text-right">{formatPrice(drive.price)}</span>
                    </div>
                  ))}
                </div>
                {validationErrors.drives && (
                  <p className="mt-1 text-red-500 text-sm">{validationErrors.drives}</p>
                )}
              </div>
            )}

            {/* iDRAC Configuration */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                iDRAC Configuration*
              </label>
              <select
                className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors`}
                value={selectedOptions.idrac}
                onChange={(e) => handleOptionChange('idrac', e.target.value)}
                required
              >
                {idracOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : '(Included)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Networking Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Networking Options</h3>

              {/* LAN on Motherboard */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  LAN on Motherboard
                </label>
                <select
                  className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                  value={selectedOptions.lan}
                  disabled
                >
                  {lanOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} (Included)
                    </option>
                  ))}
                </select>
              </div>

              {/* OCP 3.0 Network Options */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  OCP 3.0 Network Options
                </label>
                <select
                  className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                  value={selectedOptions.ocp}
                  onChange={(e) => handleOptionChange('ocp', e.target.value)}
                >
                  <option value="none">No OCP NIC</option>
                  {Object.entries(
                    ocpOptions.reduce((acc, curr) => {
                      if (curr.category !== 'none') {
                        if (!acc[curr.category]) acc[curr.category] = [];
                        acc[curr.category].push(curr);
                      }
                      return acc;
                    }, {})
                  ).map(([category, options]) => (
                    <optgroup key={category} label={`${category} Connectivity`}>
                      {options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (+{formatPrice(option.price)})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* First PCIe Expansion Slot */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  First PCIe Expansion Slot
                </label>
                <select
                  className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                  value={selectedOptions.pcie1}
                  onChange={(e) => handleOptionChange('pcie1', e.target.value)}
                  disabled={selectedOptions.bossController !== 'none'}
                >
                  {selectedOptions.bossController !== 'none' ? (
                    <option value="none">Reserved for Dell Boss Controller</option>
                  ) : (
                    <>
                      <option value="none">No Additional NIC</option>
                      {Object.entries(
                        pcieSlotOptions.reduce((acc, curr) => {
                          if (curr.category !== 'none') {
                            if (!acc[curr.category]) acc[curr.category] = [];
                            acc[curr.category].push(curr);
                          }
                          return acc;
                        }, {})
                      ).map(([category, options]) => (
                        <optgroup key={category} label={`${category} Connectivity`}>
                          {options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name} (+{formatPrice(option.price)})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </>
                  )}
                </select>
                {validationErrors.pcie1 && (
                  <p className="mt-1 text-red-500 text-sm">{validationErrors.pcie1}</p>
                )}
              </div>

              {/* Second PCIe Expansion Slot */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  Second PCIe Expansion Slot
                </label>
                <select
                  className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                  value={selectedOptions.pcie2}
                  onChange={(e) => handleOptionChange('pcie2', e.target.value)}
                >
                  <option value="none">No Additional NIC</option>
                  {Object.entries(
                    pcieSlotOptions.reduce((acc, curr) => {
                      if (curr.category !== 'none') {
                        if (!acc[curr.category]) acc[curr.category] = [];
                        acc[curr.category].push(curr);
                      }
                      return acc;
                    }, {})
                  ).map(([category, options]) => (
                    <optgroup key={category} label={`${category} Connectivity`}>
                      {options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (+{formatPrice(option.price)})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Power Supply */}
            <div className="mb-8">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-lg font-medium mb-2">
                    Power Supply Options*
                  </label>
                  <select
                    className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                      validationErrors.powerSupply ? 'border-2 border-red-500' : ''
                    }`}
                    value={selectedOptions.powerSupply}
                    onChange={(e) => handleOptionChange('powerSupply', e.target.value)}
                    required
                  >
                    <option value="">Select Power Supply</option>
                    {powerSupplyOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} (+{formatPrice(option.price)})
                      </option>
                    ))}
                  </select>
                  {validationErrors.powerSupply && (
                    <p className="mt-1 text-red-500 text-sm">{validationErrors.powerSupply}</p>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-lg font-medium mb-2">
                    QTY 1-2
                  </label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.powerSupplyCount}
                    onChange={(e) => handleOptionChange('powerSupplyCount', parseInt(e.target.value))}
                  >
                    {[1, 2].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rackmount Kit */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                Rackmount Kit
              </label>
              <select
                className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                value={selectedOptions.rackmountKit}
                onChange={(e) => handleOptionChange('rackmountKit', e.target.value)}
              >
                {rackmountKitOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Windows Server Options */}
            <div className="mb-8">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-lg font-medium mb-2">
                    Windows Server Operating System
                  </label>
                  <select
                    className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                    value={selectedOptions.windowsServer}
                    onChange={(e) => handleOptionChange('windowsServer', e.target.value)}
                  >
                    <option value="none">Select Software Option</option>
                    <optgroup label="Windows Server Standard">
                      {windowsServerOptions
                        .filter(option => option.edition === 'standard')
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} (+{formatPrice(option.price)})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Windows Server Datacenter">
                      {windowsServerOptions
                        .filter(option => option.edition === 'datacenter')
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} (+{formatPrice(option.price)})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-lg font-medium mb-2">
                    QTY 1-60
                  </label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.windowsServerCount}
                    onChange={(e) => handleOptionChange('windowsServerCount', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Windows CALs */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                Windows Server Client Access Licenses
              </label>
              {selectedOptions.windowsCals.map((calEntry, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <div className="flex-grow">
                    <select
                      className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors"
                      value={calEntry.calId}
                      onChange={(e) => {
                        const newWindowsCals = [...selectedOptions.windowsCals];
                        newWindowsCals[index].calId = e.target.value;
                        handleOptionChange('windowsCals', newWindowsCals);
                      }}
                    >
                      <option value="">Select your CAL</option>
                      {windowsCalOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (+{formatPrice(option.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <select
                      className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                      value={calEntry.quantity}
                      onChange={(e) => {
                        const newWindowsCals = [...selectedOptions.windowsCals];
                        newWindowsCals[index].quantity = parseInt(e.target.value);
                        handleOptionChange('windowsCals', newWindowsCals);
                      }}
                    >
                      {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => {
                      const newWindowsCals = selectedOptions.windowsCals.filter((_, i) => i !== index);
                      handleOptionChange('windowsCals', newWindowsCals);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => {
                  const newWindowsCals = [...selectedOptions.windowsCals, { calId: '', quantity: 1 }];
                  handleOptionChange('windowsCals', newWindowsCals);
                }}
              >
                Add CAL
              </button>
            </div>

            {/* Warranty Options */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">
                System Warranty Options*
              </label>
              <select
                className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors ${
                  validationErrors.warranty ? 'border-2 border-red-500' : ''
                }`}
                value={selectedOptions.warranty}
                onChange={(e) => handleOptionChange('warranty', e.target.value)}
                required
              >
                {warrantyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : '(Included)'}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Summary Panel */}
        <div className="md:w-1/3">
          <div
            className="fixed right-4 top-100 w-[30%] bg-gray-50 p-6 rounded-lg shadow-lg"
            style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-bold mb-4 text-[#1881AE]">Your System</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>Base Chassis</span>
                  <span className="font-medium">{formatPrice(basePrice)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Selected Options</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal() - basePrice)}</span>
                </div>
                <div className="mt-1">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {showDetails ? 'Hide details' : 'Show details'}
                  </button>
                </div>

                {showDetails && (
                  <div className="mt-4 space-y-3 text-sm">
                    {/* Chassis Details */}
                    {selectedOptions.chassis && (
                      <div>
                        <div className="font-medium">Chassis</div>
                        <div className="text-gray-600">
                          {chassisOptions.find(c => c.id === selectedOptions.chassis)?.name}
                        </div>
                      </div>
                    )}

                    {/* Bezel Details */}
                    {selectedOptions.bezel !== 'no-bezel' && (
                      <div>
                        <div className="font-medium">Front Bezel</div>
                        <div className="text-gray-600">
                          {bezelOptions.find(b => b.id === selectedOptions.bezel)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(bezelOptions.find(b => b.id === selectedOptions.bezel)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* TPM Module Details */}
                    {selectedOptions.tpmModule !== 'no-tpm' && (
                      <div>
                        <div className="font-medium">TPM Module</div>
                        <div className="text-gray-600">
                          {tpmOptions.find(t => t.id === selectedOptions.tpmModule)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(tpmOptions.find(t => t.id === selectedOptions.tpmModule)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* Processor Details */}
                    {selectedOptions.processor && (
                      <div>
                        <div className="font-medium">Processors</div>
                        <div className="text-gray-600">
                          {processors.find(p => p.id === selectedOptions.processor)?.name} x{selectedOptions.processorCount}
                        </div>
                        <div className="text-right">
                          {formatPrice(
                            (processors.find(p => p.id === selectedOptions.processor)?.price || 0) * selectedOptions.processorCount
                          )}
                        </div>
                      </div>
                    )}

                    {/* Memory Details */}
                    {selectedOptions.memory && (
                      <div>
                        <div className="font-medium">Memory</div>
                        <div className="text-gray-600">
                          {memoryOptions.find(m => m.id === selectedOptions.memory)?.name} x{selectedOptions.memoryCount}
                        </div>
                        <div className="text-right">
                          {formatPrice(
                            (memoryOptions.find(m => m.id === selectedOptions.memory)?.price || 0) * selectedOptions.memoryCount
                          )}
                        </div>
                      </div>
                    )}

                    {/* RAID Controller Details */}
                    {selectedOptions.raidController && selectedOptions.raidController !== 'none' && (
                      <div>
                        <div className="font-medium">RAID Controller</div>
                        <div className="text-gray-600">
                          {raidControllerOptions.find(r => r.id === selectedOptions.raidController)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(raidControllerOptions.find(r => r.id === selectedOptions.raidController)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* BOSS Controller Details */}
                    {selectedOptions.bossController !== 'none' && (
                      <div>
                        <div className="font-medium">BOSS Controller</div>
                        <div className="text-gray-600">
                          {bossControllerOptions.find(b => b.id === selectedOptions.bossController)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(bossControllerOptions.find(b => b.id === selectedOptions.bossController)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* Storage Options */}
                    {Object.entries(selectedOptions.driveQuantities).length > 0 && (
                      <div>
                        <div className="font-medium">Storage Drives</div>
                        {Object.entries(selectedOptions.driveQuantities).map(([driveId, quantity]) => {
                          const drive = [...systemDrives['3.5inch'], ...systemDrives['2.5inch'], ...systemDrives['nvme']].find(
                            d => d.id === driveId
                          );
                          if (drive && quantity > 0) {
                            return (
                              <div key={driveId}>
                                <div className="text-gray-600">
                                  {drive.name} x{quantity}
                                </div>
                                <div className="text-right">
                                  {formatPrice(drive.price * quantity)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {/* Networking Details */}
                    {selectedOptions.ocp !== 'none' && (
                      <div>
                        <div className="font-medium">OCP Network Card</div>
                        <div className="text-gray-600">
                          {ocpOptions.find(o => o.id === selectedOptions.ocp)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(ocpOptions.find(o => o.id === selectedOptions.ocp)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {selectedOptions.pcie1 !== 'none' && !selectedOptions.bossController && (
                      <div>
                        <div className="font-medium">First PCIe Card</div>
                        <div className="text-gray-600">
                          {pcieSlotOptions.find(p => p.id === selectedOptions.pcie1)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(pcieSlotOptions.find(p => p.id === selectedOptions.pcie1)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {selectedOptions.pcie2 !== 'none' && (
                      <div>
                        <div className="font-medium">Second PCIe Card</div>
                        <div className="text-gray-600">
                          {pcieSlotOptions.find(p => p.id === selectedOptions.pcie2)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(pcieSlotOptions.find(p => p.id === selectedOptions.pcie2)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* Power Supply Details */}
                    {selectedOptions.powerSupply && (
                      <div>
                        <div className="font-medium">Power Supply</div>
                        <div className="text-gray-600">
                          {powerSupplyOptions.find(p => p.id === selectedOptions.powerSupply)?.name} x{selectedOptions.powerSupplyCount}
                        </div>
                        <div className="text-right">
                          {formatPrice(
                            (powerSupplyOptions.find(p => p.id === selectedOptions.powerSupply)?.price || 0) *
                              selectedOptions.powerSupplyCount
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rackmount Kit Details */}
                    {selectedOptions.rackmountKit !== 'none' && (
                      <div>
                        <div className="font-medium">Rackmount Kit</div>
                        <div className="text-gray-600">
                          {rackmountKitOptions.find(r => r.id === selectedOptions.rackmountKit)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(rackmountKitOptions.find(r => r.id === selectedOptions.rackmountKit)?.price || 0)}
                        </div>
                      </div>
                    )}

                    {/* Windows Server Details */}
                    {selectedOptions.windowsServer !== 'none' && (
                      <div>
                        <div className="font-medium">Windows Server License</div>
                        <div className="text-gray-600">
                          {windowsServerOptions.find(w => w.id === selectedOptions.windowsServer)?.name} x{selectedOptions.windowsServerCount}
                        </div>
                        <div className="text-right">
                          {formatPrice(
                            (windowsServerOptions.find(w => w.id === selectedOptions.windowsServer)?.price || 0) *
                              selectedOptions.windowsServerCount
                          )}
                        </div>
                      </div>
                    )}

                    {/* Windows CALs Details */}
                    {selectedOptions.windowsCals.length > 0 && (
                      <div>
                        <div className="font-medium">Windows CALs</div>
                        {selectedOptions.windowsCals.map((calEntry, index) => {
                          const cal = windowsCalOptions.find(c => c.id === calEntry.calId);
                          if (cal) {
                            return (
                              <div key={index}>
                                <div className="text-gray-600">
                                  {cal.name} x{calEntry.quantity}
                                </div>
                                <div className="text-right">
                                  {formatPrice(cal.price * calEntry.quantity)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {/* Warranty Details */}
                    {selectedOptions.warranty && selectedOptions.warranty !== '3yr-nbd' && (
                      <div>
                        <div className="font-medium">Warranty</div>
                        <div className="text-gray-600">
                          {warrantyOptions.find(w => w.id === selectedOptions.warranty)?.name}
                        </div>
                        <div className="text-right">
                          {formatPrice(warrantyOptions.find(w => w.id === selectedOptions.warranty)?.price || 0)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <label className="text-lg font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-2 border rounded-md text-center"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center">
                  <span className="text-red-600 font-medium">*Est Lead time: 5-7 days</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Subtotal (ex. VAT)</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>VAT (20%)</span>
                  <span>{formatPrice(calculateSubtotal() * 0.20)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total (inc. VAT)</span>
                  <span>{formatPrice(calculateSubtotal() * 1.20)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-md font-medium text-white transition-colors duration-300 bg-[#1881AE] hover:bg-[#157394]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => <ServerConfigurator />;
export default App;











