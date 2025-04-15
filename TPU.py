import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# ------------------------------------------------------------------------------
# Parameters and Initialization for an 8x8 matrix multiplication
# ------------------------------------------------------------------------------
num_rows = 8
num_cols = 8

# Define matrices A and B (8x8) – same as previous examples.
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

# ------------------------------------------------------------------------------
# GPU Simulation of Matrix Multiplication
#
# In a GPU each output element is computed concurrently.
# For each element C[i,j] = sum_{k=0}^{7} (A[i,k] * B[k,j]),
# the 8 multiplications are performed in parallel.
#
# In our simulation we:
#   1. Precompute a 3D tensor "P" such that:
#        P[i,j,k] = A_matrix[i,k] * B_matrix[k,j]
#   2. Then “reduce” the vector of partial products for every (i,j)
#      in a number of sequential steps. In a real GPU a parallel reduction
#      might finish in log2(8) ≃ 3 cycles—but here we simulate a simple sequential
#      reduction for clarity.
#
# As a result, all output elements are accumulated concurrently in only 8 cycles,
# representing the key advantage of massively parallel hardware.
# ------------------------------------------------------------------------------

# Precompute partial products P with shape (num_rows, num_cols, num_cols)
# where for each (i,j): P[i,j,:] contains the 8 individual products.
P = np.empty((num_rows, num_cols, num_cols), dtype=int)
for i in range(num_rows):
    for j in range(num_cols):
        for k in range(num_cols):
            P[i, j, k] = A_matrix[i, k] * B_matrix[k, j]

# Initialize the GPU output matrix with zeros.
gpu_C = np.zeros((num_rows, num_cols), dtype=int)

# gpu_history will record the output state after each sequential reduction step.
gpu_history = []
gpu_history.append(np.copy(gpu_C))  # Cycle 0: initial state (all zeros)

# In a GPU, all cells compute the dot product in parallel.
# Here we simulate a sequential accumulation (as if doing one addition per cycle).
for k in range(num_cols):
    # Each output element is updated concurrently:
    gpu_C = gpu_C + P[:, :, k]
    gpu_history.append(np.copy(gpu_C))

print("Final GPU Result Matrix:")
print(gpu_C)
print("GPU cycles (accumulation steps):", len(gpu_history) - 1)

# ------------------------------------------------------------------------------
# Visualization: Animate the GPU Matrix Multiplication Process
# ------------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(6, 6))
cax = ax.matshow(gpu_history[0], cmap='viridis', vmin=0, vmax=np.max(gpu_history[-1]))
fig.colorbar(cax)
ax.set_title('GPU Matrix Multiplication Progress')

# Annotate the initial state.
for i in range(num_rows):
    for j in range(num_cols):
        ax.text(j, i, f"{gpu_history[0][i, j]}", va='center', ha='center', color='white')

cycle_text = ax.text(0.5, -0.1, f"Cycle: 0", transform=ax.transAxes,
                     ha="center", fontsize=12)

def update(frame):
    ax.clear()  # Clear previous drawing.
    mat = gpu_history[frame]
    cax = ax.matshow(mat, cmap='viridis', vmin=0, vmax=np.max(gpu_history[-1]))

    # Redraw the value text for each cell.
    for i in range(num_rows):
        for j in range(num_cols):
            ax.text(j, i, f"{mat[i, j]}", va='center', ha='center', color='white', fontsize=10)

    ax.set_title("GPU Matrix Multiplication Progress")
    ax.set_xticks(range(num_cols))
    ax.set_yticks(range(num_rows))
    cycle_text = ax.text(0.5, -0.15, f"Cycle: {frame}", transform=ax.transAxes,
                         ha='center', fontsize=12)
    return cax, cycle_text

ani = animation.FuncAnimation(fig, update, frames=len(gpu_history),
                              interval=600, repeat_delay=1000)
plt.show()

# To save the animation as a GIF file, uncomment the line below:
ani.save("gpu_matrix_multiplication.gif", writer="imagemagick")
