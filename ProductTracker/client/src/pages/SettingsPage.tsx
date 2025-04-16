import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { state, setTimeControls } = useGameContext();
  const { toast } = useToast();
  
  const [gameSpeed, setGameSpeed] = useState<number>(state.timeControls.speed === 'fast' ? 2 : 1);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [tutorialMode, setTutorialMode] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<string>("normal");
  const [displayName, setDisplayName] = useState<string>(state.user?.displayName || "");
  
  const handleTimeSpeedChange = (value: number[]) => {
    const speed = value[0];
    setGameSpeed(speed);
    setTimeControls({
      ...state.timeControls,
      speed: speed === 1 ? 'normal' : 'fast'
    });
    
    toast({
      title: "Game Speed Updated",
      description: `Game speed set to ${speed === 1 ? 'Normal' : 'Fast'}`,
    });
  };
  
  const handleSaveProfile = () => {
    // In a real implementation, this would save to the backend
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved",
    });
  };
  
  const handleSaveGameSettings = () => {
    // In a real implementation, this would save to the backend
    toast({
      title: "Game Settings Updated",
      description: "Your game settings have been saved",
    });
  };
  
  const handleExportData = () => {
    // In a real implementation, this would generate a file download
    toast({
      title: "Data Export",
      description: "Your simulation data is being exported",
    });
  };
  
  const handleResetSimulation = () => {
    // This would show a confirmation dialog in a real implementation
    toast({
      title: "Reset Simulation",
      description: "This feature is not available in the demo",
      variant: "destructive"
    });
  };
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Customize your simulation experience
        </p>
      </div>
      
      <Tabs defaultValue="game" className="mb-6">
        <TabsList>
          <TabsTrigger value="game">Game Settings</TabsTrigger>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Settings</CardTitle>
              <CardDescription>Customize your startup simulation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Simulation Speed</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Game Speed</Label>
                      <span className="text-sm text-gray-500">{gameSpeed === 1 ? 'Normal' : 'Fast'}</span>
                    </div>
                    <Slider
                      value={[gameSpeed]}
                      min={1}
                      max={2}
                      step={1}
                      onValueChange={handleTimeSpeedChange}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-advance">Auto Advance Time</Label>
                      <p className="text-sm text-gray-500">Automatically progress to the next quarter</p>
                    </div>
                    <Switch id="auto-advance" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Notifications & Guidance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-sm text-gray-500">Receive alerts for important business events</p>
                    </div>
                    <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="tutorial-mode">Tutorial Mode</Label>
                      <p className="text-sm text-gray-500">Show helpful tips for new players</p>
                    </div>
                    <Switch id="tutorial-mode" checked={tutorialMode} onCheckedChange={setTutorialMode} />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Game Difficulty</h3>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - More forgiving business conditions</SelectItem>
                      <SelectItem value="normal">Normal - Balanced challenge</SelectItem>
                      <SelectItem value="hard">Hard - Challenging market conditions</SelectItem>
                      <SelectItem value="realistic">Realistic - True-to-life simulation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Changing difficulty will affect market competition, customer acquisition costs, and economic events
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGameSettings} className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value="user@example.com"
                  disabled
                />
                <p className="text-xs text-gray-500">Email cannot be changed in the demo</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value="••••••••"
                  disabled
                />
                <p className="text-xs text-gray-500">Password cannot be changed in the demo</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={state.user?.role || "founder"}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder & CEO</SelectItem>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="cfo">CFO</SelectItem>
                    <SelectItem value="cmo">CMO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} className="ml-auto">Save Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or reset your simulation data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Export Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download your simulation data for backup or analysis
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <i className="fa-solid fa-file-csv mr-2"></i> Export as CSV
                  </Button>
                  <Button variant="outline" onClick={handleExportData}>
                    <i className="fa-solid fa-file-excel mr-2"></i> Export as Excel
                  </Button>
                  <Button variant="outline" onClick={handleExportData}>
                    <i className="fa-solid fa-file-code mr-2"></i> Export as JSON
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-medium text-gray-900 mb-3">Reset Simulation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start a new simulation with fresh data. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleResetSimulation}>
                  <i className="fa-solid fa-trash-can mr-2"></i> Reset Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About Startup Simulator</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Application Version</h3>
                <p className="text-sm text-gray-600">
                  Startup Business Simulator v1.0.0
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Developed By</h3>
                <p className="text-sm text-gray-600">
                  This application was built as an interactive business simulation tool to help aspiring 
                  entrepreneurs understand the startup journey.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Acknowledgements</h3>
                <p className="text-sm text-gray-600 mb-2">
                  This simulator is based on real business principles and startup methodologies:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Lean Startup Methodology by Eric Ries</li>
                  <li>Business Model Generation by Alexander Osterwalder</li>
                  <li>Zero to One by Peter Thiel</li>
                  <li>The Hard Thing About Hard Things by Ben Horowitz</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="#" className="text-primary-600 hover:underline flex items-center text-sm">
                    <i className="fa-solid fa-book mr-2"></i> Startup Development Guide
                  </a>
                  <a href="#" className="text-primary-600 hover:underline flex items-center text-sm">
                    <i className="fa-solid fa-graduation-cap mr-2"></i> Business Simulation Documentation
                  </a>
                  <a href="#" className="text-primary-600 hover:underline flex items-center text-sm">
                    <i className="fa-solid fa-code mr-2"></i> Technical Documentation
                  </a>
                  <a href="#" className="text-primary-600 hover:underline flex items-center text-sm">
                    <i className="fa-solid fa-circle-info mr-2"></i> FAQ & Help Center
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
