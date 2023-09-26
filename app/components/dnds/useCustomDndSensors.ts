// Import necessary dependencies
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

// Define the custom hook
function useCustomSensors() {
  // Configure the sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Return the configured sensors from the hook
  return sensors;
}

// Export the custom hook
export default useCustomSensors;
