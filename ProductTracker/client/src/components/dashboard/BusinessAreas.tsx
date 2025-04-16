import { useBusinessContext } from "@/contexts/BusinessContext";
import { Button } from "@/components/ui/button";
import { BusinessArea } from "@/lib/types";
import { Link } from "wouter";

export default function BusinessAreas() {
  const { getBusinessAreas } = useBusinessContext();
  
  const businessAreas = getBusinessAreas();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {businessAreas.map((area) => (
        <BusinessAreaCard key={area.name} area={area} />
      ))}
    </div>
  );
}

interface BusinessAreaCardProps {
  area: BusinessArea;
}

function BusinessAreaCard({ area }: BusinessAreaCardProps) {
  const paths: Record<string, string> = {
    "Product": "/operations",
    "Marketing": "/marketing",
    "Team": "/hr",
    "Market Share": "/competition"
  };
  
  const getAreaPath = (name: string) => paths[name] || "/";
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <i className={`${area.icon} ${area.color} mr-2`}></i>
        <h3 className="font-heading font-semibold text-gray-900">{area.name}</h3>
      </div>
      
      {area.progress !== undefined && (
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${area.progress}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{area.progress}%</span>
        </div>
      )}
      
      {Object.entries(area.metrics).map(([key, value]) => (
        <p key={key} className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{key}:</span> {value}
        </p>
      ))}
      
      <div className="mt-3 text-right">
        <Link href={getAreaPath(area.name)}>
          <Button 
            variant="link" 
            className="text-sm text-primary-600 hover:text-primary-800 font-medium p-0"
          >
            Manage <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
          </Button>
        </Link>
      </div>
    </div>
  );
}
