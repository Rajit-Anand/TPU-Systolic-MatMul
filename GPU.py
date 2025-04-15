import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# ------------------------------------------------------------------------------
# Parameters and Initialization
# ------------------------------------------------------------------------------

num_rows = 8   # Number of rows of the matrices
num_cols = 8   # Number of columns of the matrices

# Define matrices A and B (8x8). These are the same as in your systolic example.
# A_matrix = np.array([
#     [1,  2,  3,  4,  5,  6,  7,  8],
#     [8,  7,  6,  5,  4,  3,  2,  1],
#     [1,  3,  5,  7,  9, 11, 13, 15],
#     [2,  4,  6,  8, 10, 12, 14, 16],
#     [16, 14, 12, 10,  8,  6,  4,  2],
#     [15, 13, 11,  9,  7,  5,  3,  1],
#     [1,  1,  2,  2,  3,  3,  4,  4],
#     [4,  4,  3,  3,  2,  2,  1,  1]
# ], dtype=int)

# B_matrix = np.array([
#     [1, 0, 1, 0, 1, 0, 1, 0],
#     [0, 1, 0, 1, 0, 1, 0, 1],
#     [1, 0, 1, 0, 1, 0, 1, 0],
#     [0, 1, 0, 1, 0, 1, 0, 1],
#     [1, 0, 1, 0, 1, 0, 1, 0],
#     [0, 1, 0, 1, 0, 1, 0, 1],
#     [1, 0, 1, 0, 1, 0, 1, 0],
#     [0, 1, 0, 1, 0, 1, 0, 1]
# ], dtype=int)

A_matrix = np.ones((8, 8), dtype=int)
B_matrix = np.ones((8, 8), dtype=int)

# Initialize the product matrix (accumulator) as all zeros.
C_matrix = np.zeros((num_rows, num_cols), dtype=int)

# List to record the accumulator state after each elementary update.
C_history = []

# A counter for each cycle (multiplication-addition update).
cycle_count = 0

# ------------------------------------------------------------------------------
# CPU Matrix Multiplication (Triple Nested Loop)
#
# We compute:
#   C[i, j] = sum_k (A[i, k] * B[k, j])
# Each elementary computation (A[i, k] * B[k, j] added to C[i, j]) is treated as one cycle.
# We record the state of the C_matrix after each such update.
# ------------------------------------------------------------------------------
for i in range(num_rows):
    for j in range(num_cols):
        for k in range(num_cols):
            C_matrix[i, j] += A_matrix[i, k] * B_matrix[k, j]
            cycle_count += 1
            # Record the current state of the product matrix (deep copy)
            C_history.append(np.copy(C_matrix))

# Print final result and total cycle count.
print("Final Result Matrix (Product of A and B):")
print(C_matrix)
print("Total number of cycles (updates):", cycle_count)

# ------------------------------------------------------------------------------
# Visualization: Animate the CPU Matrix Multiplication Process
# ------------------------------------------------------------------------------

# Create a figure and axis for the animation.
fig, ax = plt.subplots(figsize=(6, 6))

# Display the initial state of the matrix.
initial_frame = C_history[0]
cax = ax.matshow(initial_frame, cmap='viridis')
fig.colorbar(cax)
ax.set_title('CPU Matrix Multiplication Progress')

# Annotate each cell with its numerical value.
# (Text annotations will be updated in each frame.)
for i in range(num_rows):
    for j in range(num_cols):
        ax.text(j, i, f"{initial_frame[i,j]}", va='center', ha='center', color='white')

# Display cycle count as part of the figure.
cycle_text = ax.text(0.5, -0.1, f"Cycle: 1", transform=ax.transAxes, ha="center", fontsize=12)

# Define the update function for animation.
def update(frame):
    ax.clear()  # Clear previous frame
    mat = C_history[frame]
    # Draw the matrix heat map.
    cax = ax.matshow(mat, cmap='viridis', vmin=0, vmax=np.max(C_matrix))
    # Annotate each cell with its current value.
    for i in range(num_rows):
        for j in range(num_cols):
            ax.text(j, i, f"{mat[i,j]}", va='center', ha='center', color='white', fontsize=10)
    ax.set_title("CPU Matrix Multiplication Progress")
    ax.set_xticks(range(num_cols))
    ax.set_yticks(range(num_rows))
    # Display the current cycle number.
    cycle_text = ax.text(0.5, -0.15, f"Cycle: {frame+1}", transform=ax.transAxes, ha='center', fontsize=12)
    return cax, cycle_text

# Create the animation.
# Note: The total number of frames equals the number of elementary updates.
ani = animation.FuncAnimation(fig, update, frames=len(C_history), interval=50, repeat_delay=1000)

plt.show()

# Uncomment the line below to save the animation as a GIF file:
ani.save("cpu_matrix_multiplication.gif", writer="imagemagick")
