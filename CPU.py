import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# ------------------------------------------------------------------------------
# Parameters and Initialization
# ------------------------------------------------------------------------------

DATA_WIDTH = 8      # Not needed explicitly in Python but kept for context.
ACC_WIDTH = 16      # Ditto.
num_rows = 8
num_cols = 8
num_cycles = 22  # The simulation runs from cycle 0 to cycle 21 (22 cycles)

# ------------------------------------------------------------------------------
# Define the A and B matrices (8x8) as given in the Verilog testbench.
# Note: The matrices below come from the flattened initialization in the testbench.
# ------------------------------------------------------------------------------
A_matrix = np.array([
    [1,  2,  3,  4,  5,  6,  7,  8],
    [8,  7,  6,  5,  4,  3,  2,  1],
    [1,  3,  5,  7,  9,  11, 13, 15],
    [2,  4,  6,  8,  10, 12, 14, 16],
    [16, 14, 12, 10, 8,  6,  4,  2],
    [15, 13, 11, 9,  7,  5,  3,  1],
    [1,  1,  2,  2,  3,  3,  4,  4],
    [4,  4,  3,  3,  2,  2,  1,  1]
], dtype=int)

B_matrix = np.array([
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
], dtype=int)

# A_matrix = np.ones((8, 8), dtype=int)
# B_matrix = np.ones((8, 8), dtype=int)

# ------------------------------------------------------------------------------
# Systolic Array Simulation
#
# We create three 8x8 grids:
#   - acc: holds the accumulator value for each PE.
#   - a_pipe: holds the value to be passed right (a_out).
#   - b_pipe: holds the value to be passed down (b_out).
#
# In each cycle, for each PE at position (i,j):
#   - a_in is the left input if j==0, otherwise the a_pipe from the left neighbor.
#   - b_in is the top input if i==0, otherwise the b_pipe from the PE above.
#   - The accumulator is updated as: acc[i,j] += a_in * b_in.
#   - The PE then passes a_in and b_in along to its neighbors.
#
# The left_in and top_in vectors come from the A and B matrices, respectively:
#   - For row i: if cycle >= i and cycle <= i+7 then left_in[i] = A_matrix[i, cycle-i], else 0.
#   - For col j: if cycle >= j and cycle <= j+7 then top_in[j]  = B_matrix[cycle-j, j], else 0.
# ------------------------------------------------------------------------------
# Initialize arrays (all zeros before feeding data)
acc   = np.zeros((num_rows, num_cols), dtype=int)
a_pipe = np.zeros((num_rows, num_cols), dtype=int)
b_pipe = np.zeros((num_rows, num_cols), dtype=int)

# To record the accumulator state at each cycle for visualization.
acc_history = []

for cycle in range(num_cycles):
    # Determine the "left" and "top" input vectors for this cycle.
    left_in = np.zeros(num_rows, dtype=int)
    top_in  = np.zeros(num_cols, dtype=int)

    # For each row, feed the correct element from A_matrix if in range.
    for i in range(num_rows):
        # Condition: cycle must be between i and i+7 (inclusive)
        if cycle >= i and cycle <= i + 7:
            left_in[i] = A_matrix[i, cycle - i]
        else:
            left_in[i] = 0  # outside feeding window

    # For each column, feed the correct element from B_matrix if in range.
    for j in range(num_cols):
        if cycle >= j and cycle <= j + 7:
            top_in[j] = B_matrix[cycle - j, j]
        else:
            top_in[j] = 0

    # Create new registers for the next cycle (to mimic synchronous updates).
    new_acc   = np.copy(acc)
    new_a_pipe = np.zeros_like(a_pipe)
    new_b_pipe = np.zeros_like(b_pipe)

    # Process each PE in the array.
    for i in range(num_rows):
        for j in range(num_cols):
            # Determine the inputs for this PE:
            # If at the left border, use the left_in vector.
            a_in = left_in[i] if j == 0 else a_pipe[i, j-1]
            # If at the top border, use the top_in vector.
            b_in = top_in[j]  if i == 0 else b_pipe[i-1, j]
            # Update the accumulator for this PE.
            new_acc[i, j] += a_in * b_in
            # Pass the inputs along (as outputs).
            new_a_pipe[i, j] = a_in
            new_b_pipe[i, j] = b_in

    # Update the registers for the next cycle.
    acc    = new_acc
    a_pipe = new_a_pipe
    b_pipe = new_b_pipe

    # Save a copy of the current accumulator values.
    acc_history.append(np.copy(acc))

# Print the final result matrix (accumulator state).
print("Final Result Matrix (Accumulator values):")
print(acc)

# ------------------------------------------------------------------------------
# Visualizing the Process Using Matplotlib Animation
#
# The following code creates an animation showing the evolution of the
# accumulator values across the systolic array over each cycle.
# ------------------------------------------------------------------------------

fig, ax = plt.subplots(figsize=(6, 6))
cax = ax.matshow(acc_history[0], cmap='viridis')
fig.colorbar(cax)
ax.set_title('Systolic Array Accumulator Values')

# Annotate each cell with its value.
cell_texts = [[ax.text(j, i, f"{acc_history[0][i,j]}", va='center', ha='center', color='white')
               for j in range(num_cols)] for i in range(num_rows)]

# Display cycle number as title text.
cycle_text = ax.text(0.5, -0.1, f"Cycle: 0", transform=ax.transAxes, ha="center", fontsize=12)

def update(frame):
    ax.clear()
    mat = acc_history[frame]
    cax = ax.matshow(mat, cmap='viridis', vmin=0, vmax=np.max(acc_history[-1]))
    # Draw text inside each cell.
    for i in range(num_rows):
        for j in range(num_cols):
            ax.text(j, i, f"{mat[i,j]}", va='center', ha='center', color='white', fontsize=10)
    ax.set_title("Systolic Array Accumulator Values")
    ax.set_xticks(range(num_cols))
    ax.set_yticks(range(num_rows))
    cycle_text = ax.text(0.5, -0.15, f"Cycle: {frame}", transform=ax.transAxes, ha="center", fontsize=12)
    return cax, cycle_text

ani = animation.FuncAnimation(fig, update, frames=num_cycles, interval=600, repeat_delay=1000)
plt.show()  # Ensure plt.show() is called while `ani` is still in scope.


# To save the animation as a GIF file, you can uncomment and run the following:
ani.save("systolic_array_simulation.gif", writer="imagemagick")
