import { render, screen } from '@testing-library/react';
import LogisimSimulation from '@/components/sections/LogisimSimulation';

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock FadeUp component
jest.mock('@/components/ui/FadeUp', () => {
    return function FadeUp({ children }: { children: React.ReactNode }) {
        return <div>{children}</div>;
    };
});

// Mock VideoPlayer
jest.mock('@/components/ui/VideoPlayer', () => {
    return function VideoPlayer({ title }: { title: string }) {
        return <div data-testid="video-player">{title}</div>;
    };
});

// Mock ImageLightbox
jest.mock('@/components/ui/ImageLightbox', () => {
    return function ImageLightbox() {
        return <div data-testid="lightbox" />;
    };
});

describe('LogisimSimulation', () => {
    it('renders the main heading', () => {
        render(<LogisimSimulation />);
        expect(screen.getByText('Logisim Simulation')).toBeInTheDocument();
        expect(screen.getByText('Digital Validation')).toBeInTheDocument();
    });

    it('renders all key features', () => {
        render(<LogisimSimulation />);
        expect(screen.getByText('Complete System Model')).toBeInTheDocument();
        expect(screen.getByText('Automated Testing')).toBeInTheDocument();
        expect(screen.getByText('Visual Verification')).toBeInTheDocument();
        expect(screen.getByText('Timing Analysis')).toBeInTheDocument();
    });

    it('renders verification results table', () => {
        render(<LogisimSimulation />);
        expect(screen.getByText('Arithmetic (ADD, SUB)')).toBeInTheDocument();
        expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    });

    it('renders hardware mapping table', () => {
        render(<LogisimSimulation />);
        expect(screen.getByText('Logisim Component')).toBeInTheDocument();
        expect(screen.getByText('Hardware Implementation')).toBeInTheDocument();
        expect(screen.getByText('Custom Ripple-Carry Adder')).toBeInTheDocument();
    });
});
