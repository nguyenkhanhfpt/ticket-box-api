import requests
import multiprocessing as mp
import time
import argparse
import json
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import Dict, Any, List, Tuple

def make_request(request_data: Tuple[int, Dict[str, Any], str]) -> Dict[str, Any]:
    """
    Make a single POST request to the API endpoint
    
    Args:
        request_data: Tuple containing (request_id, body_data, url)
    
    Returns:
        Dictionary with request results
    """
    request_id, body, url = request_data
    
    try:
        start_time = time.time()
        response = requests.post(
            url,
            json=body,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        end_time = time.time()

        return {
            'request_id': request_id,
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'response_time': end_time - start_time,
            'response_body': response.text[:500] if response.text else None,  # Limit response size
            'error': response.json()
        }
    
    except requests.exceptions.RequestException as e:
        return {
            'request_id': request_id,
            'status_code': None,
            'success': False,
            'response_time': None,
            'response_body': None,
            'error': str(e)
        }

def create_request_body(event_id: int, request_id: int) -> Dict[str, Any]:
    """
    Create the request body for each request
    You can customize this function based on your API requirements
    """
    return {
        'ticket_id': f'ticket_{request_id}',
        'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'email': f'user{request_id}@example.com',
        'eventId': event_id
    }

def run_parallel_requests(event_id: int, num_requests: int, num_processes: int, url: str) -> List[Dict[str, Any]]:
    """
    Run multiple requests in parallel using multiprocessing
    
    Args:
        event_id: Event ID to register for
        num_requests: Number of requests to make
        num_processes: Number of parallel processes to use
        url: API endpoint URL
    
    Returns:
        List of request results
    """
    print(f"Starting {num_requests} requests using {num_processes} processes...")
    
    # Prepare request data
    request_data = []
    for i in range(num_requests):
        body = create_request_body(event_id, i + 1)
        request_data.append((i + 1, body, url))
    
    results = []
    start_time = time.time()
    
    # Use ProcessPoolExecutor for parallel execution
    with ProcessPoolExecutor(max_workers=num_processes) as executor:
        # Submit all requests
        future_to_request = {
            executor.submit(make_request, data): data[0] 
            for data in request_data
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_request):
            request_id = future_to_request[future]
            try:
                result = future.result()
                results.append(result)
                
                # Print progress
                if len(results) % 10 == 0 or len(results) == num_requests:
                    print(f"Completed {len(results)}/{num_requests} requests")
                    
            except Exception as e:
                print(f"Request {request_id} generated an exception: {e}")
                results.append({
                    'request_id': request_id,
                    'status_code': None,
                    'success': False,
                    'response_time': None,
                    'response_body': None,
                    'error': str(e)
                })
    
    end_time = time.time()
    total_time = end_time - start_time
    
    print(f"\nAll requests completed in {total_time:.2f} seconds")
    print(f"Average time per request: {total_time/num_requests:.2f} seconds")
    
    return results

def print_summary(results: List[Dict[str, Any]]):
    """Print a summary of the request results"""
    total_requests = len(results)
    successful_requests = sum(1 for r in results if r['success'])
    failed_requests = total_requests - successful_requests
    
    print(f"\n{'='*50}")
    print(f"SUMMARY")
    print(f"{'='*50}")
    print(f"Total requests: {total_requests}")
    print(f"Successful requests: {successful_requests}")
    print(f"Failed requests: {failed_requests}")
    print(f"Success rate: {(successful_requests/total_requests)*100:.1f}%")
    
    if successful_requests > 0:
        successful_times = [r['response_time'] for r in results if r['success'] and r['response_time']]
        if successful_times:
            print(f"Average response time: {sum(successful_times)/len(successful_times):.3f} seconds")
            print(f"Min response time: {min(successful_times):.3f} seconds")
            print(f"Max response time: {max(successful_times):.3f} seconds")
    
    # Show status code distribution
    status_codes = {}
    for result in results:
        code = result['status_code'] or 'Error'
        status_codes[code] = status_codes.get(code, 0) + 1
    
    print(f"\nStatus code distribution:")
    for code, count in sorted(status_codes.items()):
        print(f"  {code}: {count} requests")
    
    # Show first few errors if any
    errors = [r for r in results if not r['success']]
    if errors:
        print(f"\nFirst 5 errors:")
        for error in errors[:5]:
            print(f"  Request {error['request_id']}: {error['error']}")

def main():
    TARGET_URL = 'http://localhost:4000/api/v1/tickets'
    parser = argparse.ArgumentParser(description='Make multiple POST requests to API endpoint')
    parser.add_argument('--eventId', '-e', type=int, default=1,
                       help='Event ID to register for (default: 1)')
    parser.add_argument('--requests', '-r', type=int, default=10,
                       help='Number of requests to make (default: 10)')
    parser.add_argument('--processes', '-p', type=int, default=mp.cpu_count(), 
                       help=f'Number of parallel processes (default: {mp.cpu_count()})')
    parser.add_argument('--url', '-u', type=str, default=TARGET_URL,
                       help=f'API endpoint URL (default: ${TARGET_URL})')
    parser.add_argument('--output', '-o', type=str,
                       help='Output file to save results (optional)')
    
    args = parser.parse_args()
    
    # Validate arguments
    if args.requests <= 0:
        print("Error: Number of requests must be positive")
        return
    
    if args.processes <= 0:
        print("Error: Number of processes must be positive")
        return
    
    print(f"Configuration:")
    print(f"  URL: {args.url}")
    print(f"  Requests: {args.requests}")
    print(f"  Processes: {args.processes}")
    print(f"  Output file: {args.output or 'None'}")
    print()
    
    # Run the requests
    results = run_parallel_requests(args.eventId, args.requests, args.processes, args.url)

    # Print summary
    print_summary(results)
    
    # Save results to file if specified
    if args.output:
        try:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\nResults saved to {args.output}")
        except Exception as e:
            print(f"Error saving results: {e}")

if __name__ == "__main__":
    main()
