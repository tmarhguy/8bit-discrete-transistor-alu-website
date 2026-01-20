import { render, screen } from '@testing-library/react';
import InteractiveScene from '@/components/3d/InteractiveScene';

// Mock Recoil or other state if needed (none used here)

// Mock React Three Fiber components
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({ camera: { position: [0, 0, 0] }, gl: { domElement: document.createElement('canvas') } }),
  useFrame: jest.fn(),
}));

// Mock Drei components
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Grid: () => <div data-testid="grid" />,
  Stats: () => <div data-testid="stats" />,
}));

// Mock Model component since it likely loads GLTF
jest.mock('@/components/3d/Model', () => {
    return function Model({ isVisible }: { isVisible: boolean }) {
        return isVisible ? <div data-testid="model" /> : null;
    };
});

describe('InteractiveScene', () => {
  const mockOnModelSelect = jest.fn();

  it('renders the canvas', () => {
    render(
      <InteractiveScene 
        selectedModel={null} 
        onModelSelect={mockOnModelSelect} 
      />
    );
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders stats when showStats is true', () => {
    render(
      <InteractiveScene 
        selectedModel={null} 
        onModelSelect={mockOnModelSelect} 
        showStats={true}
      />
    );
    expect(screen.getByTestId('stats')).toBeInTheDocument();
  });

  it('renders grid when showGrid is true', () => {
      render(
        <InteractiveScene 
          selectedModel={null} 
          onModelSelect={mockOnModelSelect} 
          showGrid={true}
        />
      );
      expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
  
  it('renders models', () => {
       render(
        <InteractiveScene 
          selectedModel={null} 
          onModelSelect={mockOnModelSelect} 
        />
      );
      // Depending on how many models are in the models array
      // We expect at least one if the array is not empty
      const models = screen.getAllByTestId('model');
      expect(models.length).toBeGreaterThan(0);
  });
});
