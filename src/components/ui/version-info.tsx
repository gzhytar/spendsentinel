'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Database, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Trash2
} from 'lucide-react';
import { VersionManager } from '@/lib/version-manager';
import { CleanupManager } from '@/lib/cleanup-manager';
import { useI18n } from '@/contexts/i18n-context';

interface VersionInfoProps {
  showDebugInfo?: boolean;
  className?: string;
}

export function VersionInfo({ showDebugInfo = false, className = '' }: VersionInfoProps) {
  const { t } = useI18n();
  const [versionInfo, setVersionInfo] = useState({
    currentVersion: null as string | null,
    lastCleanupDate: null as string | null,
    dataKeys: [] as string[],
    dataSize: 0
  });
  const [cleanupHistory, setCleanupHistory] = useState<any[]>([]);
  const [hasLegacyData, setHasLegacyData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadVersionInfo = () => {
    const info = VersionManager.getVersionInfo();
    const history = CleanupManager.getCleanupHistory();
    const legacy = VersionManager.hasLegacyData();
    
    setVersionInfo(info);
    setCleanupHistory(history);
    setHasLegacyData(legacy);
  };

  useEffect(() => {
    loadVersionInfo();
    
    // Listen for version update events
    const handleAppUpdate = (event: CustomEvent) => {
      console.log('App update detected:', event.detail);
      setTimeout(loadVersionInfo, 100); // Refresh after a brief delay
    };

    const handleMajorUpdate = (event: CustomEvent) => {
      console.log('Major app update detected:', event.detail);
      setTimeout(loadVersionInfo, 100);
    };

    window.addEventListener('app-updated', handleAppUpdate as EventListener);
    window.addEventListener('app-major-update', handleMajorUpdate as EventListener);

    return () => {
      window.removeEventListener('app-updated', handleAppUpdate as EventListener);
      window.removeEventListener('app-major-update', handleMajorUpdate as EventListener);
    };
  }, []);

  const handleForceCleanup = async () => {
    if (window.confirm('Are you sure you want to clear all localStorage data? This cannot be undone.')) {
      setIsLoading(true);
      
      try {
        VersionManager.forceCleanup();
        setTimeout(() => {
          loadVersionInfo();
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Force cleanup failed:', error);
        setIsLoading(false);
      }
    }
  };

  const handleRepairCorrupted = async () => {
    setIsLoading(true);
    
    try {
      CleanupManager.repairCorrupted();
      setTimeout(() => {
        loadVersionInfo();
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Repair failed:', error);
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!showDebugInfo && !hasLegacyData) {
    return null; // Don't show anything if not in debug mode and no issues
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <CardTitle className="text-lg">Version & Storage Info</CardTitle>
        </div>
        <CardDescription>
          App version information and localStorage status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Version */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Version:</span>
          <Badge variant="outline">
            {versionInfo.currentVersion || 'Unknown'}
          </Badge>
        </div>

        {/* Last Cleanup */}
        {versionInfo.lastCleanupDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Cleanup:</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(versionInfo.lastCleanupDate)}
            </span>
          </div>
        )}

        {/* Storage Usage */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Storage Usage:</span>
          <span className="text-sm text-muted-foreground">
            {formatBytes(versionInfo.dataSize)} ({versionInfo.dataKeys.length} keys)
          </span>
        </div>

        {/* Legacy Data Warning */}
        {hasLegacyData && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Legacy data detected. Consider updating to the latest format.
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info */}
        {showDebugInfo && (
          <>
            {/* Data Keys */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Stored Data:</span>
              <div className="flex flex-wrap gap-1">
                {versionInfo.dataKeys.map(key => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cleanup History */}
            {cleanupHistory.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Recent Cleanups:</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {cleanupHistory.slice(-3).map((cleanup, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(cleanup.timestamp)}</span>
                      </div>
                      {cleanup.options && (
                        <div className="mt-1 text-muted-foreground">
                          {cleanup.options.forceCleanup ? 'Force cleanup' : 
                           cleanup.options.specificKeys ? `Keys: ${cleanup.options.specificKeys.join(', ')}` :
                           'General cleanup'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRepairCorrupted}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Repair
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleForceCleanup}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Force Cleanup
              </Button>
            </div>
          </>
        )}

        {/* Status Indicator */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">
            Version management active
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 