import React, { useState, useEffect, useCallback } from 'react';
import { Server, HardDrive, Cpu, Award } from 'lucide-react';
import serverImage from './assets/images/server.png';
import './index.css';


const ServerConfigurator = () => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        window.parent.postMessage(
            { height: document.documentElement.scrollHeight },
            "https://www.serversource.co.uk/pages/R650xs"
        );
    };

    // Initial height calculation
    handleResize();

    // Recalculate height on window resize or content change
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, []);


  const formatPrice = (price) => {
    return `£${price.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // State to manage selected options
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
    warranty: '3yr-nbd',
  });

  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Configuration Options
  const chassisOptions = [
    { id: 'diskless', name: 'Diskless Config - No HDD/SSD', price: 0 },
    { id: '4way-3.5', name: '4 Way 3.5" Chassis', price: 0 },
    { id: '8way-2.5', name: '8 Way 2.5" Chassis', price: 0 },
    { id: '10way-2.5-nvme', name: '10 Way 2.5" NVMe Chassis', price: 0 },
  ];

  const bezelOptions = [
    { id: 'no-bezel', name: 'No Front Bezel Required', price: 0 },
    { id: 'bezel', name: 'Add Front Bezel', price: 23 },
  ];

  const tpmOptions = [
    { id: 'no-tpm', name: 'No TPM Module Required', price: 0 },
    { id: 'tpm', name: 'Add TPM Module', price: 32 },
  ];

  const processors = [
    { id: '4309Y', name: 'Intel Xeon Silver 4309Y 8C/16T 2.80GHz 12M 105W', cores: 8, price: 375.0 },
    { id: '5315Y', name: 'Intel Xeon Gold 5315Y 8C/16T 3.20GHz 12M 140W', cores: 8, price: 845.0 },
    { id: '6334', name: 'Intel Xeon Gold 6334 8C/16T 3.60GHz 18M 165W', cores: 8, price: 1170.0 },
    { id: '4310', name: 'Intel Xeon Silver 4310 12C/24T 2.10GHz 18M 120W', cores: 12, price: 350.0 },
    { id: '5317', name: 'Intel Xeon Gold 5317 12C/24T 3.00GHz 18M 150W', cores: 12, price: 915.0 },
    { id: '4314', name: 'Intel Xeon Silver 4314 16C/32T 2.40GHz 24M 135W', cores: 16, price: 485.0 },
    { id: '6326', name: 'Intel Xeon Gold 6326 16C/32T 2.90GHz 24M 185W', cores: 16, price: 860.0 },
    { id: '4316', name: 'Intel Xeon Silver 4316 20C/40T 2.30GHz 30M 150W', cores: 20, price: 725.0 },
    { id: '5318N', name: 'Intel Xeon Gold 5318N 24C/48T 2.10GHz 36M 150W', cores: 24, price: 595.0 },
    { id: '5318Y', name: 'Intel Xeon Gold 5318Y 24C/48T 2.10GHz 36M 165W', cores: 24, price: 800.0 },
    { id: '5320', name: 'Intel Xeon Gold 5320 26C/52T 2.20GHz 39M 185W', cores: 26, price: 925.0 },
    { id: '6330', name: 'Intel Xeon Gold 6330 28C/56T 2.00GHz 42M 205W', cores: 28, price: 725.0 },
    { id: '6330N', name: 'Intel Xeon Gold 6330N 28C/56T 2.20GHz 42M 165W', cores: 28, price: 1375.0 },
    { id: '6338', name: 'Intel Xeon Gold 6338 32C/64T 2.00GHz 48M 205W', cores: 32, price: 1175.0 },
    { id: '6338N', name: 'Intel Xeon Gold 6338N 32C/64T 2.20GHz 48M 185W', cores: 32, price: 1245.0 },
  ].sort((a, b) => a.cores - b.cores);

  const memoryOptions = [
    { id: '16GB', name: '16GB PC4-3200AA-R DDR4 2Rx8 3200MHz ECC', price: 40.0 },
    { id: '32GB', name: '32GB PC4-3200AA-R DDR4 2Rx4 3200MHz ECC', price: 80.0 },
    { id: '64GB', name: '64GB PC4-3200AA-R DDR4 2Rx4 3200MHz ECC', price: 160.0 },
    { id: '128GB', name: '128GB PC4-3200AA-LR DDR4 4DRx4 3200MHz ECC', price: 480.0 },
  ];

  const raidControllerOptions = [
    { id: 'none', name: 'No RAID Controller for Diskless Chassis', price: 0.0 },
    { id: 'perc-s150', name: 'PERC S150 NVMe RAID Controller', price: 0.0 },
    { id: 'perc-h355i', name: 'PERC H355i Front RAID Controller', price: 155.0 },
    { id: 'perc-h355', name: 'PERC H355 Front RAID Controller', price: 200.0 },
    { id: 'perc-h755', name: 'PERC H755 Front RAID Controller with 8GB Cache', price: 350.0 },
  ];


  const bossControllerOptions = [
    { id: 'none', name: 'No BOSS Controller', price: 0.0 },
    { id: 'boss-240', name: 'Dell BOSS Controller with 2 x 240GB M.2. SATA SSD', price: 130.0 },
    { id: 'boss-480', name: 'Dell BOSS Controller with 2 x 480GB M.2. SATA SSD', price: 220.0 },
  ];

  const systemDrives = {
    '3.5inch': [
      { id: '1tb-sata-3.5', name: '1TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 25.0 },
      { id: '2tb-sas-3.5', name: '2TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 55.0 },
      { id: '4tb-sas-3.5', name: '4TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 85.0 },
      { id: '8tb-sas-3.5', name: '8TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 145.0 },
      { id: '12tb-sas-3.5', name: '12TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 245.0 },
      { id: '12tb-sata-3.5', name: '12TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 175.0 },
      { id: '16tb-sas-3.5', name: '16TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 340.0 },
      { id: '16tb-sata-3.5', name: '16TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 155.0 },
      { id: '18tb-sas-3.5', name: '18TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 395.0 },
      { id: '18tb-sata-3.5', name: '18TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 295.0 },
      { id: '20tb-sas-3.5', name: '20TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 445.0 },
      { id: '22tb-sas-3.5', name: '22TB 7.2K, 3.5" SAS, 12G Hard Drive', price: 570.0 },
      { id: '22tb-sata-3.5', name: '22TB 7.2K, 3.5" SATA, 6G Hard Drive', price: 490.0 },
    ],
    '2.5inch': [
      { id: '600gb-sas-10k', name: '600GB 10K, 2.5" SAS, 12G Hard Drive', price: 40.0 },
      { id: '600gb-sas-15k', name: '600GB 15K, 2.5" SAS, 12G Hard Drive', price: 100.0 },
      { id: '900gb-sas-15k', name: '900GB 15K, 2.5" SAS, 12G Hard Drive', price: 175.0 },
      { id: '1tb-sas-2.5', name: '1TB 7.2K, 2.5" SAS, 12G Hard Drive', price: 90.0 },
      { id: '1tb-sata-2.5', name: '1TB 7.2K, 2.5" SATA, 6G Hard Drive', price: 45.0 },
      { id: '1.2tb-sas-10k', name: '1.2TB 10K, 2.5" SAS, 12G Hard Drive', price: 90.0 },
      { id: '2tb-sas-2.5', name: '2TB 7.2K, 2.5" SAS, 12G Hard Drive', price: 200.0 },
      { id: '2.4tb-sas-10k', name: '2.4TB 10K, 2.5" SAS, 12G Hard Drive', price: 180.0 },
      { id: '960gb-sas-ssd', name: '960GB 2.5" SAS, 12G SSD Drive', price: 250.0 },
      { id: '1.6tb-sas-ssd', name: '1.6TB 2.5" SAS, 12G SSD Drive', price: 325.0 },
      { id: '1.92tb-sas-ssd', name: '1.92TB 2.5" SAS, 12G SSD Drive', price: 325.0 },
      { id: '3.84tb-sas-ssd', name: '3.84TB 2.5" SAS, 12G SSD Drive', price: 495.0 },
      { id: '7.68tb-sas-ssd', name: '7.68TB 2.5" SAS, 12G SSD Drive', price: 900.0 },
      { id: '480gb-sata-ssd', name: '480GB 2.5" SATA, 6G SSD Drive', price: 125.0 },
      { id: '960gb-sata-ssd', name: '960GB 2.5" SATA, 6G SSD Drive', price: 225.0 },
      { id: '1.92tb-sata-ssd', name: '1.92TB 2.5" SATA, 6G SSD Drive', price: 250.0 },
      { id: '3.84tb-sata-ssd', name: '3.84TB 2.5" SATA, 6G SSD Drive', price: 375.0 },
    ],
    nvme: [
      { id: '960gb-nvme', name: '960GB 2.5" NVMe, Gen4 SSD Drive', price: 145.0 },
      { id: '1.6tb-nvme', name: '1.6TB 2.5" NVMe, Gen4 SSD Drive', price: 245.0 },
      { id: '1.92tb-nvme', name: '1.92TB 2.5" NVMe, Gen4 SSD Drive', price: 345.0 },
      { id: '3.2tb-nvme', name: '3.2TB 2.5" NVMe, Gen4 SSD Drive', price: 395.0 },
      { id: '3.84tb-nvme', name: '3.84TB 2.5" NVMe, Gen4 SSD Drive', price: 445.0 },
      { id: '6.4tb-nvme', name: '6.4TB 2.5" NVMe, Gen4 SSD Drive', price: 540.0 },
      { id: '7.68tb-nvme', name: '7.68TB 2.5" NVMe, Gen4 SSD Drive', price: 695.0 },
      { id: '15.36tb-nvme', name: '15.36TB 2.5" NVMe, Gen4 SSD Drive', price: 1099.0 },
    ],
  };

  const idracOptions = [
    { id: 'express', name: 'iDRAC9, Express 15G', price: 0.0 },
    { id: 'enterprise', name: 'iDRAC9, Enterprise 15G', price: 78.0 },
    { id: 'datacenter', name: 'iDRAC9 Datacentre 15G', price: 190.0 },
    {
      id: 'datacenter-advance',
      name: 'iDRAC9 Datacenter 15G with OpenManage Enterprise Advance+',
      price: 385.0,
    },
  ];

  const lanOptions = [
    { id: 'broadcom5720', name: 'Broadcom 5720 Dual Port 1GbE Base-T (RJ45) NIC', price: 0.0 },
  ];

  const ocpOptions = [
    { id: 'none', name: 'No OCP NIC', price: 0.0, category: 'none' },
    // 1Gbps Base-T
    {
      id: 'broadcom-5720-quad',
      name: 'Broadcom 5720 1GbE Base-T (RJ45) Quad Port OCP 3.0 NIC',
      price: 90.0,
      category: '1Gbps',
    },
    {
      id: 'intel-i350-quad',
      name: 'Intel i350 1GbE Base-T (RJ45) Quad Port OCP 3.0 NIC',
      price: 90.0,
      category: '1Gbps',
    },
    // 10Gbps Base-T
    {
      id: 'broadcom-57416',
      name: 'Broadcom 57416 10GbE Base-T (RJ45) Dual Port OCP 3.0 NIC',
      price: 160.0,
      category: '10Gbps',
    },
    {
      id: 'intel-x710-t2l',
      name: 'Intel X710-T2L 10GbE Base-T (RJ45) Dual Port OCP 3.0 NIC',
      price: 190.0,
      category: '10Gbps',
    },
    {
      id: 'intel-x710-t4',
      name: 'Intel X710-T4 10GbE Base-T (RJ45) Quad Port OCP NIC',
      price: 380.0,
      category: '10Gbps',
    },
    {
      id: 'broadcom-57454',
      name: 'Broadcom 57454 10GbE Base-T (RJ45) Quad Port OCP 3.0 NIC',
      price: 380.0,
      category: '10Gbps',
    },
    // 10Gbps SFP+
    {
      id: 'broadcom-57412-sfp',
      name: 'Broadcom 57412 10Gb SFP+ Dual Port OCP 3.0 NIC',
      price: 120.0,
      category: 'SFP+',
    },
    {
      id: 'marvell-41132',
      name: 'Marvell FastLinQ 10Gb SFP+ 41132 Dual Port OCP NIC',
      price: 245.0,
      category: 'SFP+',
    },
    {
      id: 'intel-x710-da2',
      name: 'Intel X710-DA2 10GB SFP+ Dual Port OCP 3.0 NIC',
      price: 180.0,
      category: 'SFP+',
    },
    {
      id: 'intel-x710-da4',
      name: 'Intel X710-DA4 10GB SFP+ Quad Port OCP 3.0 NIC',
      price: 360.0,
      category: 'SFP+',
    },
    // 25Gbps SFP28
    {
      id: 'broadcom-57414',
      name: 'Broadcom 57414 25Gb SFP28 Dual Port OCP 3.0 NIC',
      price: 160.0,
      category: 'SFP28',
    },
    {
      id: 'broadcom-57504',
      name: 'Broadcom 57504 25Gb SFP28 Quad Port OCP 3.0 NIC',
      price: 280.0,
      category: 'SFP28',
    },
  ];

  const pcieSlotOptions = [
    { id: 'none', name: 'No Additional NIC', price: 0.0, category: 'none' },
    // 1Gbps Base-T
    {
      id: 'broadcom-5719',
      name: 'Broadcom 5719 1Gb RJ45 Quad Port PCIe NIC',
      price: 35.0,
      category: '1Gbps',
    },
    {
      id: 'intel-i350-pcie',
      name: 'Intel i350 1Gb RJ45 Quad Port PCIe',
      price: 25.0,
      category: '1Gbps',
    },
    // 10Gbps Base-T
    {
      id: 'broadcom-57416-pcie',
      name: 'Broadcom 57416 10Gb RJ45 Dual Port PCIe NIC',
      price: 145.0,
      category: '10Gbps',
    },
    {
      id: 'intel-x710-t2l-pcie',
      name: 'Intel X710-T2L 10Gb RJ45 Dual Port PCIe NIC',
      price: 170.0,
      category: '10Gbps',
    },
    {
      id: 'intel-x710-t4-pcie',
      name: 'Intel X710-T4 10Gb RJ45 Quad Port PCIe NIC',
      price: 395.0,
      category: '10Gbps',
    },
    // Other options including HBA
    {
      id: 'dell-sas12e',
      name: 'Dell SAS12/E Direct Attached HBA',
      price: 140.0,
      category: 'HBA',
    },
    {
      id: 'dell-perc-h840',
      name: 'Dell PERC H840 HBA Card',
      price: 295.0,
      category: 'HBA',
    },
    {
      id: 'qlogic-2692',
      name: 'QLogic 2692 Dual Port FC16 16GB Fibre Channel HBA',
      price: 245.0,
      category: 'HBA',
    },
    {
      id: 'qlogic-2772',
      name: 'QLogic 2772 Dual Port FC32 32GB Fibre Channel HBA',
      price: 795.0,
      category: 'HBA',
    },
    {
      id: 'emulex-lpe36002',
      name: 'Emulex LPe36002 Dual Port FC64 64GB Fibre Channel HBA',
      price: 1595.0,
      category: 'HBA',
    },
  ];

  const powerSupplyOptions = [
    { id: '600w', name: 'Dell Platinum EPP RPSU 600W 100-240V (50/60Hz)', price: 140.0 },
    { id: '800w', name: 'Dell Platinum EPP RPSU 800W 100-240V (50/60Hz)', price: 160.0 },
    { id: '1400w', name: 'Dell Platinum EPP RPSU 1400W 100-240V (50/60Hz)', price: 200.0 },
    { id: '1100w', name: 'Dell Titanium EPP RPSU 1100W 100-240V (50/60Hz)', price: 220.0 },
    { id: '1800w', name: 'Dell Titanium ERP RPSU 1800W 200-240V (50/60Hz)', price: 240.0 },
  ];

  const rackmountKitOptions = [
    { id: 'none', name: 'No Rack kit', price: 0.0 },
    { id: 'b6', name: 'Dell B6 Sliding Rackmount Kit', price: 48.0 },
    { id: 'b6-cma', name: 'Dell B6 Sliding Rackmount Kit with Cable Management Arm', price: 96.0 },
  ];

  const windowsServerOptions = [
    // Standard Edition
    {
      id: '2022-std-16',
      name: 'Windows Server 2022 Standard, 16 Core License, 2VMs',
      price: 586.0,
      edition: 'standard',
    },
    {
      id: '2022-std-2',
      name: 'Windows Server 2022 Standard, 2 Core License',
      price: 74.0,
      edition: 'standard',
    },
    {
      id: '2019-std-16',
      name: 'Windows Server 2019 Standard, 16 Core License, 2VMs',
      price: 544.0,
      edition: 'standard',
    },
    {
      id: '2019-std-2',
      name: 'Windows Server 2019 Standard, 2 Core License',
      price: 68.0,
      edition: 'standard',
    },
    // Datacenter Edition
    {
      id: '2022-dc-16',
      name: 'Windows Server 2022 Datacentre, 16 Core License, Unlimited VMs',
      price: 3397.0,
      edition: 'datacenter',
    },
    {
      id: '2019-dc-16',
      name: 'Windows Server 2019 Datacentre, 16 Core License, Unlimited VMs',
      price: 3203.0,
      edition: 'datacenter',
    },
  ];

  const windowsCalOptions = [
    { id: '2022-rdu', name: 'Windows Server 2022 Remote Desktop User CAL', price: 84.0 },
    { id: '2022-rdd', name: 'Windows Server 2022 Remote Desktop Device CAL', price: 84.0 },
    { id: '2022-user', name: 'Windows Server 2022 User CAL', price: 28.0 },
    { id: '2022-device', name: 'Windows Server 2022 Device CAL', price: 23.0 },
    { id: '2019-rdu', name: 'Windows Server 2019 Remote Desktop User CAL', price: 62.0 },
    { id: '2019-rdd', name: 'Windows Server 2019 Remote Desktop Device CAL', price: 62.0 },
    { id: '2019-user', name: 'Windows Server 2019 User CAL', price: 24.0 },
    { id: '2019-device', name: 'Windows Server 2019 Device CAL', price: 20.0 },
  ];

  const warrantyOptions = [
    { id: '3yr-nbd', name: '3Yrs NBD Engineer Onsite Warranty', price: 0.0 },
    { id: '5yr-nbd', name: '5Yrs NBD Engineer Onsite Warranty', price: 375.0 },
    {
      id: '3yr-mission',
      name: '3Yrs Mission Critical 4Hrs & 24/7 Onsite Warranty',
      price: 360.0,
    },
    {
      id: '5yr-mission',
      name: '5Yrs Mission Critical 4Hrs & 24/7 Onsite Warranty',
      price: 780.0,
    },
  ];

  const basePrice = 1500.0;

  // Wrap getAvailableDrives in useCallback
  const getAvailableDrives = useCallback((chassisType) => {
    switch (chassisType) {
      case '4way-3.5':
        return {
          maxDrives: 4,
          drives: [...systemDrives['3.5inch'], ...systemDrives['2.5inch']],
        };
      case '8way-2.5':
        return {
          maxDrives: 8,
          drives: systemDrives['2.5inch'],
        };
      case '10way-2.5-nvme':
        return {
          maxDrives: 10,
          drives: systemDrives['nvme'],
        };
      default:
        return {
          maxDrives: 0,
          drives: [],
        };
    }
  }, []);

  const getValidMemoryQuantities = (cpuCount) => {
    if (cpuCount === 1) {
      return [1, 2, 4, 6, 8];
    } else {
      return [2, 4, 6, 8, 12, 16];
    }
  };

  const getRaidControllerOptions = (chassisType) => {
    if (chassisType === 'diskless') {
      return raidControllerOptions.filter((option) => option.id === 'none');
    } else if (chassisType === '10way-2.5-nvme') {
      return raidControllerOptions.filter((option) => option.id === 'perc-s150');
    }
    return raidControllerOptions;
  };

  const validateConfiguration = () => {
    const errors = {};

    // Required selections
    if (!selectedOptions.chassis) errors.chassis = 'Chassis selection is required';
    if (!selectedOptions.processor) errors.processor = 'Processor selection is required';
    if (!selectedOptions.memory) errors.memory = 'Memory selection is required';
    if (!selectedOptions.raidController)
      errors.raidController = 'RAID Controller selection is required';
    if (!selectedOptions.powerSupply)
      errors.powerSupply = 'Power Supply selection is required';
    if (!selectedOptions.warranty) errors.warranty = 'Warranty selection is required';

    // Memory validation
    const validMemoryQuantities = getValidMemoryQuantities(selectedOptions.processorCount);
    if (!validMemoryQuantities.includes(selectedOptions.memoryCount)) {
      errors.memoryCount = `Invalid memory quantity for ${selectedOptions.processorCount} CPU configuration`;
    }

    // Drive quantity validation
    const availableDrives = getAvailableDrives(selectedOptions.chassis);
    const totalDrives = Object.values(selectedOptions.driveQuantities).reduce(
      (a, b) => a + b,
      0
    );
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
    const bezel = bezelOptions.find((b) => b.id === selectedOptions.bezel);
    if (bezel) total += bezel.price;

    const tpm = tpmOptions.find((t) => t.id === selectedOptions.tpmModule);
    if (tpm) total += tpm.price;

    // Add processor
    if (selectedOptions.processor) {
      const processor = processors.find((p) => p.id === selectedOptions.processor);
      if (processor) {
        total += processor.price * selectedOptions.processorCount;
      }
    }

    // Add memory
    if (selectedOptions.memory) {
      const memory = memoryOptions.find((m) => m.id === selectedOptions.memory);
      if (memory) {
        total += memory.price * selectedOptions.memoryCount;
      }
    }

    // Add storage components
    if (selectedOptions.raidController) {
      const controller = raidControllerOptions.find(
        (r) => r.id === selectedOptions.raidController
      );
      if (controller) total += controller.price;
    }

    if (selectedOptions.bossController) {
      const boss = bossControllerOptions.find((b) => b.id === selectedOptions.bossController);
      if (boss) total += boss.price;
    }

    // Add system drives
    Object.entries(selectedOptions.driveQuantities).forEach(([driveId, quantity]) => {
      const drive = [
        ...systemDrives['3.5inch'],
        ...systemDrives['2.5inch'],
        ...systemDrives['nvme'],
      ].find((d) => d.id === driveId);
      if (drive) total += drive.price * quantity;
    });

    // Add networking components
    if (selectedOptions.ocp !== 'none') {
      const ocp = ocpOptions.find((o) => o.id === selectedOptions.ocp);
      if (ocp) total += ocp.price;
    }

    if (selectedOptions.pcie1 !== 'none' && selectedOptions.bossController === 'none') {
      const pcie1 = pcieSlotOptions.find((p) => p.id === selectedOptions.pcie1);
      if (pcie1) total += pcie1.price;
    }

    if (selectedOptions.pcie2 !== 'none') {
      const pcie2 = pcieSlotOptions.find((p) => p.id === selectedOptions.pcie2);
      if (pcie2) total += pcie2.price;
    }

  // Add IDRAC price - ADD THIS NEW BLOCK HERE
  if (selectedOptions.idrac && selectedOptions.idrac !== 'express') {
    const selectedIdrac = idracOptions.find(
      (option) => option.id === selectedOptions.idrac
    );
    if (selectedIdrac) {
      total += selectedIdrac.price;
    }
  }
    // Add power supply
    if (selectedOptions.powerSupply) {
      const psu = powerSupplyOptions.find((p) => p.id === selectedOptions.powerSupply);
      if (psu) total += psu.price * selectedOptions.powerSupplyCount;
    }

    // Add rackmount kit
    if (selectedOptions.rackmountKit !== 'none') {
      const rackmount = rackmountKitOptions.find((r) => r.id === selectedOptions.rackmountKit);
      if (rackmount) total += rackmount.price;
    }

    // Add Windows Server license
    if (selectedOptions.windowsServer !== 'none') {
      const license = windowsServerOptions.find((w) => w.id === selectedOptions.windowsServer);
      if (license) total += license.price * selectedOptions.windowsServerCount;
    }

    // Add Windows CALs
    selectedOptions.windowsCals.forEach((calEntry) => {
      const cal = windowsCalOptions.find((c) => c.id === calEntry.calId);
      if (cal) {
        total += cal.price * calEntry.quantity;
      }
    });

    // Add warranty
    if (selectedOptions.warranty) {
      const warranty = warrantyOptions.find((w) => w.id === selectedOptions.warranty);
      if (warranty) total += warranty.price;
    }

    return total * quantity;
  };

  // Wrap handleOptionChange in useCallback
  const handleOptionChange = useCallback((category, value) => {
    setSelectedOptions((prev) => {
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
  }, []);

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
  }, [selectedOptions.processorCount, selectedOptions.memoryCount, handleOptionChange]);

  // State to store maximum quantities for each drive
  const [maxDriveQuantities, setMaxDriveQuantities] = useState({});

  useEffect(() => {
    const availableDrives = getAvailableDrives(selectedOptions.chassis);
    const totalSelectedDrives = Object.entries(selectedOptions.driveQuantities).reduce(
      (total, [id, qty]) => total + qty,
      0
    );
    const remainingBays = availableDrives.maxDrives - totalSelectedDrives;

    const newMaxQuantities = {};
    availableDrives.drives.forEach((drive) => {
      const selectedQuantity = selectedOptions.driveQuantities[drive.id] || 0;
      newMaxQuantities[drive.id] = selectedQuantity + remainingBays;
    });

    setMaxDriveQuantities(newMaxQuantities);
  }, [selectedOptions.driveQuantities, selectedOptions.chassis, getAvailableDrives]);

  // Function to calculate the VAT
  const calculateVAT = (subtotal) => {
    return subtotal * 0.2;
  };

  // Function to calculate the total including VAT
  const calculateTotal = (subtotal) => {
    return subtotal + calculateVAT(subtotal);
  };

  // Render the component
  return (
    <div className="w-full min-h-screen pb-20 overflow-x-hidden">
      {/* Header and Images */}
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

      {/* Features */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Server style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>
            Enterprise Grade
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <HardDrive style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>
            High Performance
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Cpu style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>
            Intel Xeon CPU
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <Award style={{ color: 'black' }} size={32} />
          <span className="text-lg font-medium" style={{ color: 'black' }}>
            Warranty from 3 Years
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Left Panel */}
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold mb-4 text-[#1881AE]">Customise Your Server</h2>
          <form onSubmit={handleSubmit}>
            {/* Chassis Selection */}
            {/* ...Include all your form fields as before... */}
            {/* Chassis Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">Chassis Configuration*</label>
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
              <label className="block text-lg font-medium mb-2">Front Bezel</label>
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
              <label className="block text-lg font-medium mb-2">TPM Module</label>
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
                  <label className="block text-lg font-medium mb-2">Processor Selection*</label>
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
                  <label className="block text-lg font-medium mb-2">QTY 1-2</label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.processorCount}
                    onChange={(e) =>
                      handleOptionChange('processorCount', parseInt(e.target.value))
                    }
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
                  <label className="block text-lg font-medium mb-2">Memory Configuration*</label>
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
                    onChange={(e) =>
                      handleOptionChange('memoryCount', parseInt(e.target.value))
                    }
                  >
                    {getValidMemoryQuantities(selectedOptions.processorCount).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
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
              <label className="block text-lg font-medium mb-2">RAID Controller*</label>
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
              <label className="block text-lg font-medium mb-2">BOSS Controller for O/S</label>
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
                <label className="block text-lg font-medium mb-2">System Drives</label>
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
                          let quantity = parseInt(e.target.value);
                          if (isNaN(quantity)) quantity = 0;

                          const totalDrivesSelected = Object.entries(
                            selectedOptions.driveQuantities
                          )
                            .filter(([id]) => id !== drive.id)
                            .reduce((total, [, qty]) => total + qty, 0);

                          const availableSlots =
                            getAvailableDrives(selectedOptions.chassis).maxDrives -
                            totalDrivesSelected;

                          if (quantity > availableSlots) {
                            quantity = availableSlots;
                          }

                          const newQuantities = {
                            ...selectedOptions.driveQuantities,
                            [drive.id]: quantity,
                          };
                          if (quantity === 0) {
                            delete newQuantities[drive.id];
                          }
                          handleOptionChange('driveQuantities', newQuantities);
                        }}
                      >
                        {Array.from(
                          {
                            length:
                              Math.min(
                                maxDriveQuantities[drive.id] || 0,
                                getAvailableDrives(selectedOptions.chassis).maxDrives
                              ) + 1,
                          },
                          (_, i) => i
                        ).map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <span className="w-32 text-right">{formatPrice(drive.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total Drives Selected:{' '}
                  {Object.values(selectedOptions.driveQuantities).reduce((a, b) => a + b, 0)} /{' '}
                  {getAvailableDrives(selectedOptions.chassis).maxDrives}
                </div>
                {validationErrors.drives && (
                  <p className="mt-1 text-red-500 text-sm">{validationErrors.drives}</p>
                )}
              </div>
            )}

            {/* iDRAC Configuration */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">iDRAC Configuration*</label>
              <select
                className={`w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors`}
                value={selectedOptions.idrac}
                onChange={(e) => handleOptionChange('idrac', e.target.value)}
                required
              >
                {idracOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Networking Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Networking Options</h3>

              {/* LAN on Motherboard */}
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">LAN on Motherboard</label>
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
                <label className="block text-lg font-medium mb-2">OCP 3.0 Network Options</label>
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
                <label className="block text-lg font-medium mb-2">First PCIe Expansion Slot</label>
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
                <label className="block text-lg font-medium mb-2">Second PCIe Expansion Slot</label>
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
                  <label className="block text-lg font-medium mb-2">Power Supply Options*</label>
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
                  <label className="block text-lg font-medium mb-2">QTY 1-2</label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.powerSupplyCount}
                    onChange={(e) =>
                      handleOptionChange('powerSupplyCount', parseInt(e.target.value))
                    }
                  >
                    {[1, 2].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rackmount Kit */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">Rackmount Kit</label>
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
                        .filter((option) => option.edition === 'standard')
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} (+{formatPrice(option.price)})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Windows Server Datacenter">
                      {windowsServerOptions
                        .filter((option) => option.edition === 'datacenter')
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} (+{formatPrice(option.price)})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-lg font-medium mb-2">QTY 1-60</label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1881AE] focus:border-[#1881AE] transition-colors text-center"
                    value={selectedOptions.windowsServerCount}
                    onChange={(e) =>
                      handleOptionChange('windowsServerCount', parseInt(e.target.value))
                    }
                  >
                    {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
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
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => {
                      const newWindowsCals = selectedOptions.windowsCals.filter(
                        (_, i) => i !== index
                      );
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
                  const newWindowsCals = [
                    ...selectedOptions.windowsCals,
                    { calId: '', quantity: 1 },
                  ];
                  handleOptionChange('windowsCals', newWindowsCals);
                }}
              >
                Add CAL
              </button>
            </div>

            {/* Warranty Options */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-2">System Warranty Options*</label>
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
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            {/* The "Add to Cart" button is moved to the summary card */}
          </form>
        </div>

        {/* Right Panel - Summary */}
        <div className="md:w-1/3">
          <div
            style={{ 
              position: 'sticky',
              top: '20px',
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              marginBottom: '2rem'
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-[#1881AE]">Your System</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Selected Options:</span>
                  <span>{formatPrice(calculateSubtotal() - basePrice)}</span>
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
                    {/* Display detailed selected options */}
                    {/* Chassis */}
                    {selectedOptions.chassis && (
                      <div>
                        <div className="font-medium">Chassis</div>
                        <div className="text-gray-600">
                          {
                            chassisOptions.find((c) => c.id === selectedOptions.chassis)
                              ?.name
                          }
                        </div>
                      </div>
                    )}

                    {/* Bezel */}
                    {selectedOptions.bezel !== 'no-bezel' && (
                      <div>
                        <div className="font-medium">Front Bezel</div>
                        <div className="text-gray-600">
                          {bezelOptions.find((b) => b.id === selectedOptions.bezel)?.name}
                        </div>
                      </div>
                    )}

                    {/* TPM Module */}
                    {selectedOptions.tpmModule !== 'no-tpm' && (
                      <div>
                        <div className="font-medium">TPM Module</div>
                        <div className="text-gray-600">
                          {tpmOptions.find((t) => t.id === selectedOptions.tpmModule)?.name}
                        </div>
                      </div>
                    )}

                    {/* Processor */}
                    {selectedOptions.processor && (
                      <div>
                        <div className="font-medium">Processor</div>
                        <div className="text-gray-600">
                          {processors.find((p) => p.id === selectedOptions.processor)?.name}{' '}
                          x{selectedOptions.processorCount}
                        </div>
                      </div>
                    )}

                    {/* Memory */}
                    {selectedOptions.memory && (
                      <div>
                        <div className="font-medium">Memory</div>
                        <div className="text-gray-600">
                          {memoryOptions.find((m) => m.id === selectedOptions.memory)?.name}{' '}
                          x{selectedOptions.memoryCount}
                        </div>
                      </div>
                    )}

                    {/* RAID Controller */}
                    {selectedOptions.raidController && selectedOptions.raidController !== 'none' && (
                      <div>
                        <div className="font-medium">RAID Controller</div>
                        <div className="text-gray-600">
                          {
                            raidControllerOptions.find(
                              (r) => r.id === selectedOptions.raidController
                            )?.name
                          }
                        </div>
                      </div>
                    )}

                    {/* BOSS Controller */}
                    {selectedOptions.bossController && selectedOptions.bossController !== 'none' && (
                      <div>
                        <div className="font-medium">BOSS Controller</div>
                        <div className="text-gray-600">
                          {
                            bossControllerOptions.find(
                              (b) => b.id === selectedOptions.bossController
                            )?.name
                          }
                        </div>
                      </div>
                    )}

                    {/* System Drives */}
                    {Object.keys(selectedOptions.driveQuantities).length > 0 && (
                      <div>
                        <div className="font-medium">System Drives</div>
                        {Object.entries(selectedOptions.driveQuantities).map(
                          ([driveId, qty]) => {
                            const drive = [
                              ...systemDrives['3.5inch'],
                              ...systemDrives['2.5inch'],
                              ...systemDrives['nvme'],
                            ].find((d) => d.id === driveId);
                            return (
                              <div key={driveId} className="text-gray-600">
                                {drive?.name} x{qty}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {/* iDRAC Configuration */}
                    {selectedOptions.idrac && selectedOptions.idrac !== 'express' && (
                      <div>
                        <div className="font-medium">iDRAC Configuration</div>
                        <div className="text-gray-600">
                          {idracOptions.find((i) => i.id === selectedOptions.idrac)?.name}
                        </div>
                      </div>
                    )}

                    {/* OCP Network Card */}
                    {selectedOptions.ocp && selectedOptions.ocp !== 'none' && (
                      <div>
                        <div className="font-medium">OCP Network Card</div>
                        <div className="text-gray-600">
                          {ocpOptions.find((o) => o.id === selectedOptions.ocp)?.name}
                        </div>
                      </div>
                    )}

                    {/* PCIe Expansion Slot 1 */}
                    {selectedOptions.pcie1 &&
                      selectedOptions.pcie1 !== 'none' &&
                      selectedOptions.bossController === 'none' && (
                        <div>
                          <div className="font-medium">First PCIe Expansion Slot</div>
                          <div className="text-gray-600">
                            {pcieSlotOptions.find((p) => p.id === selectedOptions.pcie1)?.name}
                          </div>
                        </div>
                      )}

                    {/* PCIe Expansion Slot 2 */}
                    {selectedOptions.pcie2 && selectedOptions.pcie2 !== 'none' && (
                      <div>
                        <div className="font-medium">Second PCIe Expansion Slot</div>
                        <div className="text-gray-600">
                          {pcieSlotOptions.find((p) => p.id === selectedOptions.pcie2)?.name}
                        </div>
                      </div>
                    )}

                    {/* Power Supply */}
                    {selectedOptions.powerSupply && (
                      <div>
                        <div className="font-medium">Power Supply</div>
                        <div className="text-gray-600">
                          {
                            powerSupplyOptions.find(
                              (p) => p.id === selectedOptions.powerSupply
                            )?.name
                          }{' '}
                          x{selectedOptions.powerSupplyCount}
                        </div>
                      </div>
                    )}

                    {/* Rackmount Kit */}
                    {selectedOptions.rackmountKit && selectedOptions.rackmountKit !== 'none' && (
                      <div>
                        <div className="font-medium">Rackmount Kit</div>
                        <div className="text-gray-600">
                          {
                            rackmountKitOptions.find(
                              (r) => r.id === selectedOptions.rackmountKit
                            )?.name
                          }
                        </div>
                      </div>
                    )}

                    {/* Windows Server */}
                    {selectedOptions.windowsServer && selectedOptions.windowsServer !== 'none' && (
                      <div>
                        <div className="font-medium">Windows Server License</div>
                        <div className="text-gray-600">
                          {
                            windowsServerOptions.find(
                              (w) => w.id === selectedOptions.windowsServer
                            )?.name
                          }{' '}
                          x{selectedOptions.windowsServerCount}
                        </div>
                      </div>
                    )}

                    {/* Windows CALs */}
                    {selectedOptions.windowsCals.length > 0 && (
                      <div>
                        <div className="font-medium">Windows CALs</div>
                        {selectedOptions.windowsCals.map((calEntry, index) => {
                          const cal = windowsCalOptions.find((c) => c.id === calEntry.calId);
                          return (
                            <div key={index} className="text-gray-600">
                              {cal?.name} x{calEntry.quantity}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Warranty */}
                    {selectedOptions.warranty && selectedOptions.warranty !== '3yr-nbd' && (
                      <div>
                        <div className="font-medium">Warranty</div>
                        <div className="text-gray-600">
                          {
                            warrantyOptions.find(
                              (w) => w.id === selectedOptions.warranty
                            )?.name
                          }
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
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
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
                  <span>{formatPrice(calculateVAT(calculateSubtotal()))}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total (inc. VAT)</span>
                  <span>{formatPrice(calculateTotal(calculateSubtotal()))}</span>
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













