import { NextResponse } from 'next/server';
import { INITIAL_CHARITY_REFRIGERATORS } from '@/lib/data/charity-data';
import { CharityRefrigerator } from '@/types/charity';

// In-memory runtime cache for IoT sensor updates during server lifetime
let runtimeRefrigerators: CharityRefrigerator[] = [...INITIAL_CHARITY_REFRIGERATORS];

/**
 * GET: Retrieve latest IoT sensor telemetry across all charity refrigerators
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    count: runtimeRefrigerators.length,
    timestamp: new Date().toISOString(),
    network: 'Jordan Smart Charity Refrigerator IoT Network (Waffer)',
    refrigerators: runtimeRefrigerators,
  });
}

/**
 * POST: Receive IoT sensor telemetry reading from smart charity refrigerator hardware
 * Supports ESP32, NB-IoT, Raspberry Pi, and Waffer IoT Simulator
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sensor_device_id,
      refrigerator_id,
      status,
      fill_percentage,
      temperature_celsius,
      estimated_meals_count,
      food_description,
      battery_level,
      signal_strength,
    } = body;

    if (!sensor_device_id && !refrigerator_id) {
      return NextResponse.json(
        { success: false, error: 'Missing sensor_device_id or refrigerator_id' },
        { status: 400 }
      );
    }

    const targetIndex = runtimeRefrigerators.findIndex(
      (r) =>
        r.sensor_device_id === sensor_device_id ||
        r.id === refrigerator_id
    );

    const now = new Date().toISOString();

    if (targetIndex !== -1) {
      const existing = runtimeRefrigerators[targetIndex];
      const updated: CharityRefrigerator = {
        ...existing,
        status: status || existing.status,
        fill_percentage: typeof fill_percentage === 'number' ? fill_percentage : existing.fill_percentage,
        temperature_celsius: typeof temperature_celsius === 'number' ? temperature_celsius : existing.temperature_celsius,
        estimated_meals_count: typeof estimated_meals_count === 'number' ? estimated_meals_count : existing.estimated_meals_count,
        food_description: food_description || existing.food_description,
        sensor_battery_level: typeof battery_level === 'number' ? battery_level : existing.sensor_battery_level,
        sensor_signal_strength: signal_strength || existing.sensor_signal_strength,
        last_sensor_update: now,
        last_restocked_at: status === 'food_available' && existing.status !== 'food_available' ? now : existing.last_restocked_at,
      };

      runtimeRefrigerators[targetIndex] = updated;

      return NextResponse.json({
        success: true,
        message: 'Telemetry received successfully and refrigerator status updated',
        refrigerator: updated,
        server_time: now,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Refrigerator device not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid telemetry payload', details: String(error) },
      { status: 500 }
    );
  }
}
