#
# Write a function that returns True if the
# input graph is 3-colorable.
#
# You're given a magical function, graph_is_4colorable
# that will return True if the input graph is
# 4-colorable and False otherwise.
#
# This program reduces 3 colorable to 4 colorable
# by showing that 3 colorable's input can be solved
# by transforming it into a problem for 4 colorable
# in polynomial time.

from fourcolor import graph_is_4colorable
    
def add_edges(index, n, g):
    gprime = []
    for row_index in xrange(n):
        row = g[row_index]
        newrow = row[:] + [1]
        gprime.append(newrow)
    lastrow = [1 for i in xrange(n-1)] + [0]
    gprime.append(lastrow)
    return gprime

def graph_is_3colorable(g):
    if not graph_is_4colorable(g):
        return False
    # The graph is 4 colorable. Is it 3 colorable?
    # For each vertex, add an edge to every other vertex,
    # and check to see if it is four colorable.
    # If they are all still four colorable, then it is
    # 3 colorable. If one of them is not four colorable,
    # then it is NOT 3 colorable.
    num_vertices = len(g)
    for vertex in range(0, num_vertices):
        gprime = add_edges(0, num_vertices, g)
        if not graph_is_4colorable(gprime):
            return False
    return True

def test():
    g1 = [[0, 1, 1, 0],
          [1, 0, 0, 1],
          [1, 0, 0, 1],
          [0, 1, 1, 0]]
    assert graph_is_3colorable(g1)

    g2 = [[0, 1, 1, 1],
          [1, 0, 0, 1],
          [1, 0, 0, 1],
          [1, 1, 1, 0]]
    assert graph_is_3colorable(g2)

    g3 = [[0, 1, 1, 1],
          [1, 0, 1, 1],
          [1, 1, 0, 1],
          [1, 1, 1, 0]]
    assert not graph_is_3colorable(g3)
