#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>

double calculate_shannon_entropy(const std::vector<unsigned char>& buffer) {
    if (buffer.empty()) return 0.0;

    double count[256] = {0.0};
    for (unsigned char byte : buffer) {
        count[byte]++;
    }

    double entropy = 0.0;
    double total_bytes = static_cast<double>(buffer.size());

    for (int i = 0; i < 256; i++) {
        if (count[i] > 0) {
            double p = count[i] / total_bytes;
            entropy -= p * (std::log2(p));
        }
    }
    return entropy;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Usage: ./entropy_analyzer <file_path>" << std::endl;
        return 1;
    }

    std::ifstream file(argv[1], std::ios::binary);
    if (!file) {
        std::cerr << "Failed to open file." << std::endl;
        return 1;
    }

    std::vector<unsigned char> buffer((std::istreambuf_iterator<char>(file)),
                                       std::istreambuf_iterator<char>());

    double entropy = calculate_shannon_entropy(buffer);
    std::cout << "File: " << argv[1] << "\nEntropy Level: " << entropy << std::endl;

    if (entropy > 7.2) {
        std::cout << "[DANGER] High entropy detected! File may contain packed malware or ransomware." << std::endl;
    } else {
        std::cout << "[SAFE] Low/Normal entropy." << std::endl;
    }

    return 0;
}