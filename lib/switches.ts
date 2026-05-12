export type SwitchStatus = "online" | "offline" | "unknown";

export interface NetworkSwitch {
  id: string;
  name: string;
  ip: string;
  location: string;
  type?: "core" | "distribution" | "access" | "wireless" | "ubiquiti";
}

export const SWITCHES: NetworkSwitch[] = [
  { id: "core-switch", name: "Core Switch", ip: "10.1.255.1", location: "Core Infrastructure", type: "core" },
  { id: "firewall", name: "Firewall", ip: "10.1.255.2", location: "Core Infrastructure", type: "core" },

  { id: "pbacsw100", name: "PBACSW100", ip: "10.1.15.10", location: "Lantai 5 Sport Clinic", type: "access" },
  { id: "pbacsw101", name: "PBACSW101", ip: "10.1.15.11", location: "Lantai 5 Panel Krakatau", type: "access" },

  { id: "pbacsw40", name: "PBACSW40", ip: "10.30.8.250", location: "Lantai 2 Gedung Annex 1", type: "access" },
  { id: "pbacsw2", name: "PBACSW2", ip: "10.30.8.36", location: "Lantai 2 Gedung Annex 1", type: "ubiquiti" },

  { id: "pbacsw44", name: "PBACSW44", ip: "10.30.8.248", location: "Lantai 1 Gedung Annex", type: "access" },

  { id: "pbacsw-lt6", name: "PBACSW-LT6", ip: "10.30.15.9", location: "Lantai 6 Gedung Annex", type: "core" },
  { id: "server-core-mgmt", name: "Server Core Switch", ip: "103.167.218.66", location: "Lantai 6 Gedung Annex", type: "core" },

  { id: "aruba-3126", name: "Aruba 3126sw/3900F", ip: "10.30.9.181", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw01", name: "PBACSW01", ip: "10.30.11.44", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw02", name: "PBACSW02", ip: "10.30.11.42", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw03", name: "PBACSW03", ip: "10.30.8.234", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw04", name: "PBACSW04", ip: "10.30.8.235", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw05", name: "PBACSW05", ip: "10.30.8.153", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw06-main", name: "PBACSW06", ip: "10.30.8.213", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw08-main", name: "PBACSW08", ip: "10.30.9.209", location: "Main Distribution", type: "distribution" },
  { id: "pbacsw09", name: "PBACSW09", ip: "10.30.8.237", location: "Main Distribution", type: "distribution" },

  { id: "pbacsw41-mcu", name: "PBACSW41-MCU", ip: "10.30.8.108", location: "RS Server Room (MCU)", type: "core" },
  { id: "pbswsrvr", name: "PBSWSRVR", ip: "10.30.9.38", location: "RS Server Room (MCU)", type: "core" },
  { id: "pbacsw38", name: "PBACSW38", ip: "10.30.8.247", location: "RS Server Room (MCU)", type: "access" },

  { id: "pbacsw15", name: "PBACSW15", ip: "10.30.8.214", location: "RS LI 3 Ruang Bersalin", type: "access" },
  { id: "pbacsw13", name: "PBACSW13", ip: "10.30.8.231", location: "RS LI 3 Ruang Bersalin", type: "ubiquiti" },
  { id: "pbacsw14", name: "PBACSW14", ip: "10.30.8.241", location: "RS LI 3 Ruang Bersalin", type: "access" },

  { id: "pbacsw39", name: "PBACSW39", ip: "10.30.8.202", location: "AT1 Distribution", type: "distribution" },
  { id: "pbacsw42", name: "PBACSW42", ip: "10.30.8.229", location: "AT1 Distribution", type: "access" },

  { id: "pbacsw10", name: "PBACSW10", ip: "10.30.8.219", location: "RS LI 3 Ruang Camar", type: "ubiquiti" },
  { id: "pbacsw11", name: "PBACSW11", ip: "10.30.8.240", location: "RS LI 3 Ruang Camar", type: "access" },
  { id: "pbacsw12", name: "PBACSW12", ip: "10.30.8.251", location: "RS LI 3 Ruang Camar", type: "access" },

  { id: "pbacsw45", name: "PBACSW45", ip: "10.30.8.230", location: "RS LI 2 Ruang Operasi", type: "access" },
  { id: "pbacsw20", name: "PBACSW20", ip: "10.30.8.238", location: "RS LI 2 Ruang Operasi", type: "access" },
  { id: "pbacsw21", name: "PBACSW21", ip: "10.30.8.249", location: "RS LI 2 Ruang Operasi", type: "access" },

  { id: "pbacsw18", name: "PBACSW18", ip: "10.30.8.220", location: "RS LI 2 Ruang Centrawasih", type: "ubiquiti" },
  { id: "pbacsw16", name: "PBACSW16", ip: "10.30.8.242", location: "RS LI 2 Ruang Centrawasih", type: "access" },
  { id: "pbacsw17", name: "PBACSW17", ip: "10.30.8.243", location: "RS LI 2 Ruang Centrawasih", type: "access" },

  { id: "pbacsw24", name: "PBACSW24", ip: "10.30.8.244", location: "RS LI 1 Medical Center", type: "access" },
  { id: "pbacsw06-mc", name: "PBACSW06", ip: "10.30.8.209", location: "RS LI 1 Medical Center", type: "access" },
  { id: "pbacsw08-mc", name: "PBACSW08", ip: "10.30.8.204", location: "RS LI 1 Medical Center", type: "access" },
  { id: "pbacsw27", name: "PBACSW27", ip: "10.30.8.206", location: "RS LI 1 Medical Center", type: "access" },

  { id: "pbacsw31", name: "PBACSW31", ip: "10.30.8.26", location: "Radiologi", type: "distribution" },
  { id: "pbacsw37", name: "PBACSW37", ip: "10.30.8.212", location: "Radiologi", type: "access" },
  { id: "pbacsw30", name: "PBACSW30", ip: "10.30.8.208", location: "Radiologi", type: "access" },
  { id: "pbacsw32", name: "PBACSW32", ip: "10.30.8.210", location: "Radiologi", type: "access" },
  { id: "pbacsw34", name: "PBACSW34", ip: "10.30.8.211", location: "Radiologi", type: "access" },
  { id: "pbacsw35", name: "PBACSW35", ip: "10.30.8.215", location: "Radiologi", type: "access" },
  { id: "pbacsw-radiologi", name: "PBACSW-RADIOLOGI", ip: "10.30.8.245", location: "Radiologi", type: "access" },
  { id: "pbacsw43", name: "PBACSW43", ip: "10.30.8.246", location: "Radiologi", type: "access" },
];