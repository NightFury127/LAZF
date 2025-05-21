"use client";

import { Button } from "@/components/ui/Button";

export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Button Component Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Primary Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="xs">Extra Small</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="xl">Extra Large</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Secondary Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="xs">Extra Small</Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" size="xl">Extra Large</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Outline Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="xs">Extra Small</Button>
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="outline" size="md">Medium</Button>
            <Button variant="outline" size="lg">Large</Button>
            <Button variant="outline" size="xl">Extra Large</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Ghost Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost" size="xs">Extra Small</Button>
            <Button variant="ghost" size="sm">Small</Button>
            <Button variant="ghost" size="md">Medium</Button>
            <Button variant="ghost" size="lg">Large</Button>
            <Button variant="ghost" size="xl">Extra Large</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Danger Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="danger" size="xs">Extra Small</Button>
            <Button variant="danger" size="sm">Small</Button>
            <Button variant="danger" size="md">Medium</Button>
            <Button variant="danger" size="lg">Large</Button>
            <Button variant="danger" size="xl">Extra Large</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Neon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="neon-blue" size="md">Neon Blue</Button>
            <Button variant="neon-purple" size="md">Neon Purple</Button>
            <Button variant="neon-green" size="md">Neon Green</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Loading State</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="md" isLoading>Loading</Button>
            <Button variant="secondary" size="md" isLoading>Loading</Button>
            <Button variant="outline" size="md" isLoading>Loading</Button>
            <Button variant="neon-blue" size="md" isLoading>Loading</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Disabled State</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="md" disabled>Disabled</Button>
            <Button variant="secondary" size="md" disabled>Disabled</Button>
            <Button variant="outline" size="md" disabled>Disabled</Button>
            <Button variant="neon-blue" size="md" disabled>Disabled</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Full Width</h2>
          <div className="space-y-4">
            <Button variant="primary" size="md" fullWidth>Full Width Button</Button>
            <Button variant="secondary" size="md" fullWidth>Full Width Button</Button>
            <Button variant="outline" size="md" fullWidth>Full Width Button</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">With Glow Effect</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="md" withGlow>Primary with Glow</Button>
            <Button variant="neon-blue" size="md" withGlow>Neon Blue with Glow</Button>
            <Button variant="neon-purple" size="md" withGlow>Neon Purple with Glow</Button>
            <Button variant="neon-green" size="md" withGlow>Neon Green with Glow</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
