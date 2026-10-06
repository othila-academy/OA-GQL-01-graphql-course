import unittest

from trace_resolvers import format_summary


class FormatSummaryTest(unittest.TestCase):
    def test_aggregates_calls_most_frequent_first(self):
        calls = {
            "Query.events": {"count": 1, "ms": 0.2},
            "Event.organizer": {"count": 32, "ms": 1.1},
            "Event.participants": {"count": 32, "ms": 1.6},
        }
        self.assertEqual(
            format_summary("GetEvents", 4.3, calls),
            [
                "[trace] GetEvents · 4.3 ms · 65 résolveurs",
                "  Event.participants   ×32   1.6 ms",
                "  Event.organizer      ×32   1.1 ms",
                "  Query.events         ×1    0.2 ms",
            ],
        )

    def test_silent_when_no_handwritten_resolver_ran(self):
        self.assertEqual(format_summary("IntrospectionQuery", 1.0, {}), [])


if __name__ == "__main__":
    unittest.main()
