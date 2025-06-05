'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Tabs,  TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Moon, 
  Sun, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Book,
  Beaker,
  Calculator,
  Atom,
  Zap,
  CircuitBoard,
  Target,
  TrendingUp
} from 'lucide-react';

// Types
interface Chapter {
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  chapter: string;
  class: string;
  unit: string;
  yearWiseQuestionCount: {
    [year: string]: number;
  };
  questionSolved: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  isWeakChapter: boolean;
}

interface FilterState {
  selectedClasses: string[];
  selectedUnits: string[];
  selectedStatus: string[];
  showWeakChapters: boolean;
  sortBy: 'chapter' | 'totalQuestions' | 'questionSolved' | 'recentQuestions';
  sortOrder: 'asc' | 'desc';
}

// Mock data
const mockChapters: Chapter[] = [
  {
    "subject": "Physics",
    "chapter": "Mathematics in Physics",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 2,
      "2021": 5,
      "2022": 5,
      "2023": 3,
      "2024": 7,
      "2025": 6
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Units and Dimensions",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 6,
      "2021": 8,
      "2022": 4,
      "2023": 6,
      "2024": 3,
      "2025": 10
    },
    "questionSolved": 39,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Motion In One Dimension",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 10,
      "2021": 6,
      "2022": 7,
      "2023": 0,
      "2024": 2,
      "2025": 6
    },
    "questionSolved": 33,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Motion In Two Dimensions",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 10,
      "2021": 2,
      "2022": 7,
      "2023": 8,
      "2024": 0,
      "2025": 8
    },
    "questionSolved": 38,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Laws of Motion",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 0,
      "2021": 6,
      "2022": 5,
      "2023": 8,
      "2024": 6,
      "2025": 8
    },
    "questionSolved": 36,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Work Power Energy",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 4,
      "2021": 9,
      "2022": 10,
      "2023": 2,
      "2024": 7,
      "2025": 5
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Center of Mass Momentum and Collision",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 5,
      "2021": 2,
      "2022": 7,
      "2023": 6,
      "2024": 10,
      "2025": 0
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Rotational Motion",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 9,
      "2021": 9,
      "2022": 9,
      "2023": 9,
      "2024": 2,
      "2025": 5
    },
    "questionSolved": 52,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Gravitation",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 4,
      "2021": 5,
      "2022": 9,
      "2023": 0,
      "2024": 6,
      "2025": 8
    },
    "questionSolved": 35,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Mechanical Properties of Solids",
    "class": "Class 11",
    "unit": "Mechanics 2",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 6,
      "2021": 0,
      "2022": 2,
      "2023": 10,
      "2024": 10,
      "2025": 7
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Mechanical Properties of Fluids",
    "class": "Class 11",
    "unit": "Mechanics 2",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 0,
      "2021": 1,
      "2022": 0,
      "2023": 0,
      "2024": 7,
      "2025": 8
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Thermal Properties of Matter",
    "class": "Class 11",
    "unit": "Thermodynamics",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 9,
      "2021": 10,
      "2022": 0,
      "2023": 0,
      "2024": 9,
      "2025": 1
    },
    "questionSolved": 35,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Thermodynamics",
    "class": "Class 11",
    "unit": "Thermodynamics",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 10,
      "2021": 9,
      "2022": 5,
      "2023": 6,
      "2024": 8,
      "2025": 4
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Kinetic Theory of Gases",
    "class": "Class 11",
    "unit": "Thermodynamics",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 7,
      "2021": 3,
      "2022": 8,
      "2023": 2,
      "2024": 5,
      "2025": 3
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Oscillations",
    "class": "Class 11",
    "unit": "Mechanics 2",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 2,
      "2021": 1,
      "2022": 4,
      "2023": 10,
      "2024": 2,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Waves and Sound",
    "class": "Class 11",
    "unit": "Mechanics 2",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 4,
      "2021": 2,
      "2022": 8,
      "2023": 6,
      "2024": 8,
      "2025": 6
    },
    "questionSolved": 22,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Electrostatics",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 1,
      "2021": 3,
      "2022": 1,
      "2023": 3,
      "2024": 3,
      "2025": 7
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Capacitance",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 9,
      "2021": 1,
      "2022": 5,
      "2023": 7,
      "2024": 8,
      "2025": 5
    },
    "questionSolved": 11,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Current Electricity",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 10,
      "2021": 0,
      "2022": 4,
      "2023": 6,
      "2024": 8,
      "2025": 10
    },
    "questionSolved": 38,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Magnetic Properties of Matter",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 8,
      "2021": 6,
      "2022": 2,
      "2023": 9,
      "2024": 1,
      "2025": 2
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Magnetic Effects of Current",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 8,
      "2021": 0,
      "2022": 2,
      "2023": 4,
      "2024": 0,
      "2025": 4
    },
    "questionSolved": 21,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Electromagnetic Induction",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 10,
      "2021": 9,
      "2022": 1,
      "2023": 9,
      "2024": 4,
      "2025": 7
    },
    "questionSolved": 16,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Alternating Current",
    "class": "Class 12",
    "unit": "Electromagnetism",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 4,
      "2021": 5,
      "2022": 9,
      "2023": 1,
      "2024": 10,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Electromagnetic Waves",
    "class": "Class 12",
    "unit": "Miscellaneous",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 6,
      "2021": 0,
      "2022": 2,
      "2023": 5,
      "2024": 9,
      "2025": 9
    },
    "questionSolved": 28,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Ray Optics",
    "class": "Class 12",
    "unit": "Optics",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 6,
      "2021": 10,
      "2022": 4,
      "2023": 10,
      "2024": 6,
      "2025": 10
    },
    "questionSolved": 30,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Wave Optics",
    "class": "Class 12",
    "unit": "Optics",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 10,
      "2021": 10,
      "2022": 9,
      "2023": 8,
      "2024": 5,
      "2025": 4
    },
    "questionSolved": 6,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Dual Nature of Matter",
    "class": "Class 12",
    "unit": "Modern Physics",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 0,
      "2021": 6,
      "2022": 0,
      "2023": 4,
      "2024": 7,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Atomic Physics",
    "class": "Class 12",
    "unit": "Modern Physics",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 4,
      "2021": 1,
      "2022": 7,
      "2023": 4,
      "2024": 2,
      "2025": 1
    },
    "questionSolved": 14,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Nuclear Physics",
    "class": "Class 12",
    "unit": "Modern Physics",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 2,
      "2021": 6,
      "2022": 3,
      "2023": 5,
      "2024": 2,
      "2025": 8
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Semiconductors",
    "class": "Class 12",
    "unit": "Miscellaneous",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 10,
      "2021": 9,
      "2022": 8,
      "2023": 6,
      "2024": 2,
      "2025": 7
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Physics",
    "chapter": "Communication System",
    "class": "Class 12",
    "unit": "Miscellaneous",
    "yearWiseQuestionCount": {
      "2019": 5,
      "2020": 10,
      "2021": 8,
      "2022": 2,
      "2023": 5,
      "2024": 1,
      "2025": 10
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Experimental Physics",
    "class": "Class 12",
    "unit": "Miscellaneous",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 7,
      "2021": 4,
      "2022": 10,
      "2023": 5,
      "2024": 8,
      "2025": 0
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 2,
      "2021": 8,
      "2022": 2,
      "2023": 7,
      "2024": 8,
      "2025": 4
    },
    "questionSolved": 28,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Structure of Atom",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 3,
      "2021": 10,
      "2022": 5,
      "2023": 6,
      "2024": 6,
      "2025": 10
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Classification of Elements and Periodicity in Properties",
    "class": "Class 11",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 8,
      "2021": 1,
      "2022": 2,
      "2023": 3,
      "2024": 9,
      "2025": 5
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Chemical Bonding and Molecular Structure",
    "class": "Class 11",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 5,
      "2021": 2,
      "2022": 0,
      "2023": 5,
      "2024": 5,
      "2025": 3
    },
    "questionSolved": 22,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "States of Matter",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 1,
      "2021": 1,
      "2022": 1,
      "2023": 1,
      "2024": 5,
      "2025": 9
    },
    "questionSolved": 9,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Thermodynamics (C)",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 9,
      "2021": 2,
      "2022": 0,
      "2023": 2,
      "2024": 0,
      "2025": 7
    },
    "questionSolved": 28,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Chemical Equilibrium",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 3,
      "2021": 5,
      "2022": 7,
      "2023": 5,
      "2024": 9,
      "2025": 2
    },
    "questionSolved": 35,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Ionic Equilibrium",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 5,
      "2020": 2,
      "2021": 7,
      "2022": 3,
      "2023": 4,
      "2024": 5,
      "2025": 2
    },
    "questionSolved": 5,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Redox Reactions",
    "class": "Class 11",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 2,
      "2021": 1,
      "2022": 6,
      "2023": 4,
      "2024": 2,
      "2025": 7
    },
    "questionSolved": 11,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Hydrogen",
    "class": "Class 11",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 6,
      "2021": 1,
      "2022": 7,
      "2023": 10,
      "2024": 4,
      "2025": 0
    },
    "questionSolved": 36,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "s Block Elements",
    "class": "Class 11",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 4,
      "2021": 4,
      "2022": 7,
      "2023": 6,
      "2024": 2,
      "2025": 10
    },
    "questionSolved": 33,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "p Block Elements (Group 13 & 14)",
    "class": "Class 11",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 5,
      "2021": 2,
      "2022": 10,
      "2023": 4,
      "2024": 10,
      "2025": 8
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "General Organic Chemistry",
    "class": "Class 11",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 0,
      "2021": 0,
      "2022": 7,
      "2023": 6,
      "2024": 5,
      "2025": 6
    },
    "questionSolved": 33,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Hydrocarbons",
    "class": "Class 11",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 5,
      "2021": 0,
      "2022": 6,
      "2023": 6,
      "2024": 4,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Environmental Chemistry",
    "class": "Class 11",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 1,
      "2021": 4,
      "2022": 10,
      "2023": 5,
      "2024": 3,
      "2025": 6
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Solid State",
    "class": "Class 12",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 8,
      "2021": 6,
      "2022": 3,
      "2023": 8,
      "2024": 7,
      "2025": 9
    },
    "questionSolved": 50,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Solutions",
    "class": "Class 12",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 2,
      "2021": 7,
      "2022": 7,
      "2023": 7,
      "2024": 8,
      "2025": 1
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "class": "Class 12",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 0,
      "2021": 5,
      "2022": 3,
      "2023": 10,
      "2024": 2,
      "2025": 10
    },
    "questionSolved": 6,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Chemical Kinetics",
    "class": "Class 12",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 9,
      "2021": 7,
      "2022": 0,
      "2023": 10,
      "2024": 0,
      "2025": 4
    },
    "questionSolved": 31,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Surface Chemistry",
    "class": "Class 12",
    "unit": "Physical Chemistry",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 2,
      "2021": 8,
      "2022": 8,
      "2023": 9,
      "2024": 1,
      "2025": 10
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "General Principles and Processes of Isolation of Metals",
    "class": "Class 12",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 0,
      "2021": 3,
      "2022": 0,
      "2023": 2,
      "2024": 0,
      "2025": 3
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "p Block Elements (Group 15, 16, 17 & 18)",
    "class": "Class 12",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 3,
      "2021": 8,
      "2022": 0,
      "2023": 4,
      "2024": 4,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "d and f Block Elements",
    "class": "Class 12",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 4,
      "2021": 7,
      "2022": 0,
      "2023": 9,
      "2024": 10,
      "2025": 8
    },
    "questionSolved": 33,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Coordination Compounds",
    "class": "Class 12",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 3,
      "2021": 1,
      "2022": 0,
      "2023": 1,
      "2024": 8,
      "2025": 10
    },
    "questionSolved": 24,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Haloalkanes and Haloarenes",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 4,
      "2021": 10,
      "2022": 6,
      "2023": 8,
      "2024": 1,
      "2025": 3
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Alcohols Phenols and Ethers",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 0,
      "2021": 2,
      "2022": 2,
      "2023": 5,
      "2024": 5,
      "2025": 5
    },
    "questionSolved": 20,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Aldehydes and Ketones",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 3,
      "2021": 9,
      "2022": 0,
      "2023": 6,
      "2024": 1,
      "2025": 3
    },
    "questionSolved": 21,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Carboxylic Acid Derivatives",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 6,
      "2021": 0,
      "2022": 6,
      "2023": 3,
      "2024": 4,
      "2025": 8
    },
    "questionSolved": 30,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Amines",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 10,
      "2021": 6,
      "2022": 2,
      "2023": 7,
      "2024": 5,
      "2025": 4
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Biomolecules",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 0,
      "2021": 0,
      "2022": 0,
      "2023": 8,
      "2024": 9,
      "2025": 2
    },
    "questionSolved": 18,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Chemistry",
    "chapter": "Polymers",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 6,
      "2021": 9,
      "2022": 8,
      "2023": 1,
      "2024": 4,
      "2025": 6
    },
    "questionSolved": 35,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Chemistry in Everyday Life",
    "class": "Class 12",
    "unit": "Organic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 7,
      "2021": 6,
      "2022": 1,
      "2023": 2,
      "2024": 2,
      "2025": 6
    },
    "questionSolved": 28,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Chemistry",
    "chapter": "Practical Chemistry",
    "class": "Class 12",
    "unit": "Inorganic Chemistry",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 4,
      "2021": 9,
      "2022": 5,
      "2023": 3,
      "2024": 1,
      "2025": 3
    },
    "questionSolved": 20,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Basic of Mathematics",
    "class": "Class 11",
    "unit": "Miscellaneous",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 9,
      "2021": 6,
      "2022": 5,
      "2023": 1,
      "2024": 1,
      "2025": 8
    },
    "questionSolved": 21,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Quadratic Equation",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 6,
      "2021": 1,
      "2022": 1,
      "2023": 9,
      "2024": 1,
      "2025": 1
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Complex Number",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 7,
      "2021": 5,
      "2022": 1,
      "2023": 7,
      "2024": 5,
      "2025": 5
    },
    "questionSolved": 31,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Permutation Combination",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 5,
      "2020": 5,
      "2021": 1,
      "2022": 6,
      "2023": 8,
      "2024": 7,
      "2025": 3
    },
    "questionSolved": 4,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Sequences and Series",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 8,
      "2021": 5,
      "2022": 0,
      "2023": 10,
      "2024": 0,
      "2025": 9
    },
    "questionSolved": 36,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Mathematical Induction",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 9,
      "2021": 10,
      "2022": 7,
      "2023": 6,
      "2024": 4,
      "2025": 9
    },
    "questionSolved": 31,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Binomial Theorem",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 3,
      "2021": 4,
      "2022": 1,
      "2023": 2,
      "2024": 8,
      "2025": 9
    },
    "questionSolved": 28,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Trigonometric Ratios & Identities",
    "class": "Class 11",
    "unit": "Trigonometry",
    "yearWiseQuestionCount": {
      "2019": 8,
      "2020": 9,
      "2021": 4,
      "2022": 9,
      "2023": 8,
      "2024": 0,
      "2025": 6
    },
    "questionSolved": 6,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Trigonometric Equations",
    "class": "Class 11",
    "unit": "Trigonometry",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 4,
      "2021": 10,
      "2022": 0,
      "2023": 1,
      "2024": 8,
      "2025": 3
    },
    "questionSolved": 28,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Straight Lines",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 1,
      "2021": 2,
      "2022": 7,
      "2023": 3,
      "2024": 3,
      "2025": 8
    },
    "questionSolved": 7,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Pair of Lines",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 3,
      "2021": 1,
      "2022": 1,
      "2023": 3,
      "2024": 10,
      "2025": 6
    },
    "questionSolved": 26,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Circle",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 2,
      "2021": 2,
      "2022": 2,
      "2023": 8,
      "2024": 7,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Parabola",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 3,
      "2021": 3,
      "2022": 1,
      "2023": 6,
      "2024": 0,
      "2025": 6
    },
    "questionSolved": 26,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Ellipse",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 9,
      "2020": 3,
      "2021": 10,
      "2022": 6,
      "2023": 2,
      "2024": 4,
      "2025": 6
    },
    "questionSolved": 25,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Hyperbola",
    "class": "Class 11",
    "unit": "Coordinate Geometry",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 5,
      "2021": 3,
      "2022": 4,
      "2023": 8,
      "2024": 6,
      "2025": 1
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Limits",
    "class": "Class 11",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 1,
      "2020": 4,
      "2021": 4,
      "2022": 8,
      "2023": 10,
      "2024": 10,
      "2025": 8
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Mathematical Reasoning",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 2,
      "2021": 10,
      "2022": 2,
      "2023": 6,
      "2024": 0,
      "2025": 0
    },
    "questionSolved": 23,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Statistics",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 0,
      "2021": 4,
      "2022": 3,
      "2023": 9,
      "2024": 7,
      "2025": 9
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Heights and Distances",
    "class": "Class 11",
    "unit": "Trigonometry",
    "yearWiseQuestionCount": {
      "2019": 7,
      "2020": 9,
      "2021": 8,
      "2022": 6,
      "2023": 1,
      "2024": 9,
      "2025": 2
    },
    "questionSolved": 42,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Properties of Triangles",
    "class": "Class 11",
    "unit": "Trigonometry",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 8,
      "2021": 8,
      "2022": 6,
      "2023": 4,
      "2024": 6,
      "2025": 3
    },
    "questionSolved": 9,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Sets and Relations",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 3,
      "2021": 8,
      "2022": 7,
      "2023": 5,
      "2024": 2,
      "2025": 8
    },
    "questionSolved": 25,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Matrices",
    "class": "Class 12",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 9,
      "2021": 0,
      "2022": 4,
      "2023": 1,
      "2024": 5,
      "2025": 4
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Determinants",
    "class": "Class 12",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 5,
      "2020": 9,
      "2021": 9,
      "2022": 6,
      "2023": 5,
      "2024": 10,
      "2025": 0
    },
    "questionSolved": 10,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Inverse Trigonometric Functions",
    "class": "Class 12",
    "unit": "Trigonometry",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 8,
      "2021": 1,
      "2022": 10,
      "2023": 10,
      "2024": 1,
      "2025": 10
    },
    "questionSolved": 17,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Functions",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 7,
      "2021": 5,
      "2022": 6,
      "2023": 0,
      "2024": 5,
      "2025": 0
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Continuity and Differentiability",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 3,
      "2020": 2,
      "2021": 6,
      "2022": 5,
      "2023": 6,
      "2024": 4,
      "2025": 6
    },
    "questionSolved": 32,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Differentiation",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 0,
      "2020": 8,
      "2021": 8,
      "2022": 9,
      "2023": 5,
      "2024": 5,
      "2025": 7
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Application of Derivatives",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 9,
      "2021": 4,
      "2022": 0,
      "2023": 6,
      "2024": 4,
      "2025": 4
    },
    "questionSolved": 31,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Indefinite Integration",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 5,
      "2021": 3,
      "2022": 4,
      "2023": 9,
      "2024": 9,
      "2025": 9
    },
    "questionSolved": 19,
    "status": "In Progress",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Definite Integration",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 6,
      "2020": 10,
      "2021": 8,
      "2022": 5,
      "2023": 3,
      "2024": 4,
      "2025": 7
    },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Area Under Curves",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 5,
      "2020": 4,
      "2021": 8,
      "2022": 4,
      "2023": 0,
      "2024": 6,
      "2025": 4
    },
    "questionSolved": 31,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Differential Equations",
    "class": "Class 12",
    "unit": "Calculus",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 5,
      "2021": 2,
      "2022": 1,
      "2023": 5,
      "2024": 8,
      "2025": 3
    },
    "questionSolved": 28,
    "status": "Completed",
    "isWeakChapter": false
  },
  {
    "subject": "Mathematics",
    "chapter": "Vector Algebra",
    "class": "Class 12",
    "unit": "Vector",
    "yearWiseQuestionCount": {
      "2019": 10,
      "2020": 7,
      "2021": 5,
      "2022": 7,
      "2023": 0,
      "2024": 0,
      "2025": 6
    },
    "questionSolved": 3,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Three Dimensional Geometry",
    "class": "Class 12",
    "unit": "Vector",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 1,
      "2021": 5,
      "2022": 10,
      "2023": 3,
      "2024": 9,
      "2025": 8
    },
    "questionSolved": 24,
    "status": "In Progress",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Linear Programming",
    "class": "Class 12",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 2,
      "2020": 5,
      "2021": 3,
      "2022": 5,
      "2023": 0,
      "2024": 10,
      "2025": 6
    },
    "questionSolved": 31,
    "status": "Completed",
    "isWeakChapter": true
  },
  {
    "subject": "Mathematics",
    "chapter": "Probability",
    "class": "Class 12",
    "unit": "Algebra",
    "yearWiseQuestionCount": {
      "2019": 4,
      "2020": 6,
      "2021": 2,
      "2022": 4,
      "2023": 5,
      "2024": 9,
      "2025": 5
    },
    "questionSolved": 35,
    "status": "Completed",
    "isWeakChapter": true
  }
]


// Random icon assignment
const chapterIcons = [Book, Atom, Zap, CircuitBoard, Target, TrendingUp];

const getChapterIcon = (chapter: string) => {
  const iconIndex = chapter.charCodeAt(chapter.length - 1) % chapterIcons.length;
  return chapterIcons[iconIndex];
};

// Helper functions
const getTotalQuestions = (yearWiseCount: { [year: string]: number }) => {
  return Object.values(yearWiseCount).reduce((sum, count) => sum + count, 0);
};

const getRecentQuestions = (yearWiseCount: { [year: string]: number }) => {
  const recentYears = ['2023', '2024', '2025'];
  return recentYears.reduce((sum, year) => sum + (yearWiseCount[year] || 0), 0);
};

const getProgressPercentage = (solved: number, total: number) => {
  return total > 0 ? Math.round((solved / total) * 100) : 0;
};

// Multi-select component
const MultiSelect = ({ 
  options, 
  selectedValues, 
  onSelectionChange, 
  placeholder 
}: {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter(v => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        {selectedValues.length > 0 
          ? `${selectedValues.length} selected` 
          : placeholder
        }
        <ArrowUpDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                readOnly
                className="rounded"
              />
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Chapter card component
const ChapterCard = ({ chapter }: { chapter: Chapter }) => {
  const IconComponent = getChapterIcon(chapter.chapter);
  const totalQuestions = getTotalQuestions(chapter.yearWiseQuestionCount);
  const recentQuestions = getRecentQuestions(chapter.yearWiseQuestionCount);
  const progress = getProgressPercentage(chapter.questionSolved, totalQuestions);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {chapter.chapter}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chapter.class} • {chapter.unit}
                </p>
              </div>
              
              <div className="flex flex-col gap-1 items-end">
                <Badge className={getStatusColor(chapter.status)}>
                  {chapter.status}
                </Badge>
                {chapter.isWeakChapter && (
                  <Badge variant="destructive" className="text-xs">Weak</Badge>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            {totalQuestions > 0 && (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-xs font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {chapter.questionSolved}/{totalQuestions} solved
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {recentQuestions} recent
                </span>
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">
                Total: {totalQuestions} questions
              </div>
            </div>

            {/* Year-wise breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {Object.entries(chapter.yearWiseQuestionCount).map(([year, count]) => (
                  <div key={year} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {year}: {count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const ChapterListApp = () => {
  const [activeSubject, setActiveSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedClasses: [],
    selectedUnits: [],
    selectedStatus: [],
    showWeakChapters: false,
    sortBy: 'chapter',
    sortOrder: 'asc'
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Get unique classes and units for current subject
  const subjectChapters = mockChapters.filter(chapter => chapter.subject === activeSubject);
  const uniqueClasses = [...new Set(subjectChapters.map(chapter => chapter.class))].sort();
  const uniqueUnits = [...new Set(subjectChapters.map(chapter => chapter.unit))].sort();
  const statusOptions = ['Not Started', 'In Progress', 'Completed'];

  // Get filtered and sorted chapters
  const filteredChapters = useMemo(() => {
    let filtered = mockChapters.filter(chapter => {
      // Filter by subject
      if (chapter.subject !== activeSubject) return false;
      
      // Filter by classes
      if (filters.selectedClasses.length > 0 && !filters.selectedClasses.includes(chapter.class)) {
        return false;
      }
      
      // Filter by units
      if (filters.selectedUnits.length > 0 && !filters.selectedUnits.includes(chapter.unit)) {
        return false;
      }
      
      // Filter by status
      if (filters.selectedStatus.length > 0 && !filters.selectedStatus.includes(chapter.status)) {
        return false;
      }
      
      // Filter by weak chapters
      if (filters.showWeakChapters && !chapter.isWeakChapter) {
        return false;
      }
      
      return true;
    });

    // Sort chapters
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (filters.sortBy) {
        case 'chapter':
          aValue = a.chapter.toLowerCase();
          bValue = b.chapter.toLowerCase();
          break;
        case 'totalQuestions':
          aValue = getTotalQuestions(a.yearWiseQuestionCount);
          bValue = getTotalQuestions(b.yearWiseQuestionCount);
          break;
        case 'questionSolved':
          aValue = a.questionSolved;
          bValue = b.questionSolved;
          break;
        case 'recentQuestions':
          aValue = getRecentQuestions(a.yearWiseQuestionCount);
          bValue = getRecentQuestions(b.yearWiseQuestionCount);
          break;
        default:
          aValue = a.chapter.toLowerCase();
          bValue = b.chapter.toLowerCase();
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [activeSubject, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters when subject changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      selectedClasses: [],
      selectedUnits: [],
      selectedStatus: [],
      showWeakChapters: false
    }));
  }, [activeSubject]);

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Physics': return Book;
      case 'Chemistry': return Beaker;
      case 'Mathematics': return Calculator;
      default: return Book;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Chapter Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your learning progress across subjects
            </p>
          </div>
          
          {/* Dark mode toggle */}
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Switch 
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        {/* Subject Tabs */}
        <Tabs value={activeSubject} onValueChange={(value) => setActiveSubject(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map((subject) => {
              const IconComponent = getSubjectIcon(subject);
              const count = mockChapters.filter(ch => ch.subject === subject).length;
              return (
                <TabsTrigger key={subject} value={subject} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{subject}</span>
                  <span className="sm:hidden">{subject.slice(0, 4)}</span>
                  <Badge variant="secondary" className="ml-1">{count}</Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Filters */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Filters</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilters({
                  selectedClasses: [],
                  selectedUnits: [],
                  selectedStatus: [],
                  showWeakChapters: false,
                  sortBy: 'chapter',
                  sortOrder: 'asc'
                })}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Class Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Class
                </label>
                <MultiSelect
                  options={uniqueClasses}
                  selectedValues={filters.selectedClasses}
                  onSelectionChange={(values) => updateFilters({ selectedClasses: values })}
                  placeholder="Select Classes"
                />
              </div>

              {/* Unit Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Unit
                </label>
                <MultiSelect
                  options={uniqueUnits}
                  selectedValues={filters.selectedUnits}
                  onSelectionChange={(values) => updateFilters({ selectedUnits: values })}
                  placeholder="Select Units"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Status
                </label>
                <MultiSelect
                  options={statusOptions}
                  selectedValues={filters.selectedStatus}
                  onSelectionChange={(values) => updateFilters({ selectedStatus: values })}
                  placeholder="Select Status"
                />
              </div>

              {/* Weak Chapters Toggle */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Weak Chapters
                </label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch 
                    checked={filters.showWeakChapters}
                    onCheckedChange={(checked) => updateFilters({ showWeakChapters: checked })}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Show only weak chapters
                  </span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Sort by
                </label>
                <div className="flex gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilters({ sortBy: value as any })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chapter">Chapter Name</SelectItem>
                      <SelectItem value="totalQuestions">Total Questions</SelectItem>
                      <SelectItem value="questionSolved">Questions Solved</SelectItem>
                      <SelectItem value="recentQuestions">Recent Questions</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateFilters({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                  >
                    {filters.sortOrder === 'asc' ? 
                      <ArrowUp className="h-4 w-4" /> : 
                      <ArrowDown className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredChapters.length} of {subjectChapters.length} chapters
              </p>
            </div>

            {/* Chapter List */}
            <div className="grid gap-4">
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chapter, index) => (
                  <ChapterCard key={`${chapter.subject}-${index}`} chapter={chapter} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-2">
                    <Book className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">No chapters found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ChapterListApp;