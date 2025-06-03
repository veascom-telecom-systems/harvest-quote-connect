import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ProductsDebugInfo = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { data: products, isLoading, error, isError, isFetching } = useProducts();

  const runDiagnostics = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Direct Supabase query
      const start1 = Date.now();
      const { data: directData, error: directError } = await supabase
        .from('products')
        .select('*')
        .eq('availability', true);
      const time1 = Date.now() - start1;

      results.tests.push({
        name: 'Direct Supabase Query',
        success: !directError,
        time: time1,
        data: directData?.length || 0,
        error: directError?.message
      });

      // Test 2: Connection test
      const start2 = Date.now();
      const { data: connectionData, error: connectionError } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      const time2 = Date.now() - start2;

      results.tests.push({
        name: 'Connection Test',
        success: !connectionError,
        time: time2,
        error: connectionError?.message
      });

      // Test 3: Auth status
      const { data: authData } = await supabase.auth.getSession();
      results.tests.push({
        name: 'Auth Status',
        success: true,
        data: authData.session ? 'Authenticated' : 'Anonymous'
      });

      // Test 4: RLS test
      const { data: rlsData, error: rlsError } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      results.tests.push({
        name: 'RLS Access Test',
        success: !rlsError,
        error: rlsError?.message
      });

    } catch (err: any) {
      results.tests.push({
        name: 'Unexpected Error',
        success: false,
        error: err.message
      });
    }

    setTestResults(results);
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          variant="outline"
          size="sm"
          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          🐛 Debug Products
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Products Debug Information
            <Button
              onClick={() => setShowDebug(false)}
              variant="outline"
              size="sm"
            >
              ✕ Close
            </Button>
          </CardTitle>
          <CardDescription>
            Diagnostic information for products loading issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* React Query Status */}
          <div>
            <h3 className="font-semibold mb-2">React Query Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>isLoading: <Badge variant={isLoading ? "destructive" : "secondary"}>{String(isLoading)}</Badge></div>
              <div>isError: <Badge variant={isError ? "destructive" : "secondary"}>{String(isError)}</Badge></div>
              <div>isFetching: <Badge variant={isFetching ? "destructive" : "secondary"}>{String(isFetching)}</Badge></div>
              <div>Products Count: <Badge>{products?.length || 0}</Badge></div>
            </div>
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <strong>Error:</strong> {error.message}
              </div>
            )}
          </div>

          {/* Products Data */}
          {products && products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sample Product Data</h3>
              <div className="bg-gray-50 p-3 rounded text-xs">
                <pre>{JSON.stringify(products[0], null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Diagnostics */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Database Diagnostics</h3>
              <Button onClick={runDiagnostics} size="sm">
                Run Tests
              </Button>
            </div>
            
            {testResults && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  Last run: {new Date(testResults.timestamp).toLocaleString()}
                </div>
                {testResults.tests.map((test: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{test.name}</span>
                      {test.time && <span className="text-xs text-gray-500 ml-2">({test.time}ms)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {test.data && <Badge variant="outline">{test.data}</Badge>}
                      <Badge variant={test.success ? "default" : "destructive"}>
                        {test.success ? "✓" : "✗"}
                      </Badge>
                    </div>
                    {test.error && (
                      <div className="text-xs text-red-600 mt-1">{test.error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Environment Info */}
          <div>
            <h3 className="font-semibold mb-2">Environment</h3>
            <div className="text-sm space-y-1">
              <div>URL: {window.location.href}</div>
              <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
              <div>Supabase URL: {supabase.supabaseUrl}</div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div>
            <h3 className="font-semibold mb-2">Troubleshooting Steps</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Check browser console for JavaScript errors</li>
              <li>Verify network requests in DevTools Network tab</li>
              <li>Ensure Supabase project is active and accessible</li>
              <li>Check if RLS policies allow SELECT access</li>
              <li>Verify React Query is properly configured</li>
              <li>Clear browser cache and reload</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
